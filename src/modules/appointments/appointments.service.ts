import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { ConfigService } from '@nestjs/config';
import { Appointment } from '../../entities/appointment.entity';
import { DayOff } from '../../entities/day-off.entity';
import { UnavailableHour } from '../../entities/unavailable-hour.entity';
import {
  CreateAppointmentDto,
  GetAvailableSlotsDto,
  AvailableSlotResponseDto,
  AppointmentResponseDto,
} from './dto';
import { TimeUtils } from '../../common/utils/time.utils';
import { BUSINESS_RULES } from '../../common/constants/business-rules.constants';

@Injectable()
export class AppointmentsService {
  private readonly slotDurationMinutes: number;
  private readonly maxSlotsPerAppointment: number;
  private readonly operationalStartHour: number;
  private readonly operationalEndHour: number;
  private readonly operationalDays: number[];

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: EntityRepository<Appointment>,

    @InjectRepository(DayOff)
    private readonly dayOffRepository: EntityRepository<DayOff>,

    @InjectRepository(UnavailableHour)
    private readonly unavailableHourRepository: EntityRepository<UnavailableHour>,

    private readonly configService: ConfigService,
  ) {
    // Load configuration from environment variables
    this.slotDurationMinutes = this.configService.get<number>(
      'SLOT_DURATION_MINUTES',
      BUSINESS_RULES.DEFAULT_SLOT_DURATION_MINUTES,
    );
    this.maxSlotsPerAppointment = this.configService.get<number>(
      'MAX_SLOTS_PER_APPOINTMENT',
      BUSINESS_RULES.DEFAULT_MAX_SLOTS,
    );
    this.operationalStartHour = this.configService.get<number>(
      'OPERATIONAL_START_HOUR',
      BUSINESS_RULES.DEFAULT_OPERATIONAL_START_HOUR,
    );
    this.operationalEndHour = this.configService.get<number>(
      'OPERATIONAL_END_HOUR',
      BUSINESS_RULES.DEFAULT_OPERATIONAL_END_HOUR,
    );

    const daysString = this.configService.get<string>(
      'OPERATIONAL_DAYS',
      '1,2,3,4,5',
    );
    this.operationalDays = daysString.split(',').map((d) => parseInt(d.trim()));
  }

  // Helper method to get EntityManager from repository
  private get em(): EntityManager {
    return this.appointmentRepository.getEntityManager();
  }

  /**
   * Get available slots for a specific date
   */
  async getAvailableSlots(
    dto: GetAvailableSlotsDto,
  ): Promise<AvailableSlotResponseDto[]> {
    const date = TimeUtils.parseDate(dto.date);
    const dayOfWeek = TimeUtils.getDayOfWeek(date);

    // Check if it's an operational day
    if (!this.operationalDays.includes(dayOfWeek)) {
      return [];
    }

    // Check if it's a day off
    const isDayOff = await this.dayOffRepository.findOne({
      date: date,
    });
    if (isDayOff) {
      return [];
    }

    // Generate all possible time slots
    const allSlots = TimeUtils.generateTimeSlots(
      this.operationalStartHour,
      this.operationalEndHour,
      this.slotDurationMinutes,
    );

    // Get unavailable hours for this day of week
    const unavailableHours = await this.unavailableHourRepository.find({
      dayOfWeek,
    });

    // Get existing appointments for this date
    const existingAppointments = await this.appointmentRepository.find({
      date: date,
    });

    // Build response
    const availableSlots: AvailableSlotResponseDto[] = [];

    for (const timeSlot of allSlots) {
      // Check if slot is in unavailable hours
      const isUnavailable = unavailableHours.some((uh) =>
        TimeUtils.isTimeInRange(timeSlot, uh.startTime, uh.endTime),
      );

      if (isUnavailable) {
        continue;
      }

      // Check how many slots are already booked at this time
      const bookedSlots = existingAppointments
        .filter((apt) => apt.time === timeSlot)
        .reduce((sum, apt) => sum + apt.slotsBooked, 0);

      const availableCount = Math.max(
        0,
        this.maxSlotsPerAppointment - bookedSlots,
      );

      availableSlots.push({
        date: dto.date,
        time: timeSlot,
        available_slots: availableCount,
      });
    }

    return availableSlots;
  }

  /**
   * Create a new appointment
   */
  async createAppointment(
    dto: CreateAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    const date = TimeUtils.parseDate(dto.date);
    const slotsToBook = dto.slotsBooked || 1;

    // Validate slots to book
    if (slotsToBook > this.maxSlotsPerAppointment) {
      throw new BadRequestException(
        `Cannot book more than ${this.maxSlotsPerAppointment} slots per appointment`,
      );
    }

    // Check if it's an operational day
    const dayOfWeek = TimeUtils.getDayOfWeek(date);
    if (!this.operationalDays.includes(dayOfWeek)) {
      throw new BadRequestException('Selected date is not an operational day');
    }

    // Check if it's a day off
    const isDayOff = await this.dayOffRepository.findOne({ date });
    if (isDayOff) {
      throw new BadRequestException(
        `Selected date is a day off: ${isDayOff.reason || 'Holiday'}`,
      );
    }

    // Check if time is within operational hours
    const allSlots = TimeUtils.generateTimeSlots(
      this.operationalStartHour,
      this.operationalEndHour,
      this.slotDurationMinutes,
    );
    if (!allSlots.includes(dto.time)) {
      throw new BadRequestException(
        'Selected time is outside operational hours',
      );
    }

    // Check unavailable hours
    const unavailableHours = await this.unavailableHourRepository.find({
      dayOfWeek,
    });
    const isUnavailable = unavailableHours.some((uh) =>
      TimeUtils.isTimeInRange(dto.time, uh.startTime, uh.endTime),
    );
    if (isUnavailable) {
      throw new BadRequestException('Selected time is unavailable');
    }

    // Check if slot is available
    const existingAppointments = await this.appointmentRepository.find({
      date,
      time: dto.time,
    });

    const bookedSlots = existingAppointments.reduce(
      (sum, apt) => sum + apt.slotsBooked,
      0,
    );

    if (bookedSlots + slotsToBook > this.maxSlotsPerAppointment) {
      throw new ConflictException('No available slots at the selected time');
    }

    // Create appointment
    const appointment = new Appointment(date, dto.time, slotsToBook);
    appointment.customerName = dto.customerName;
    appointment.customerEmail = dto.customerEmail;
    appointment.customerPhone = dto.customerPhone;

    this.em.persist(appointment);
    await this.em.flush();

    return this.mapToResponseDto(appointment);
  }

  /**
   * Get appointment by ID
   */
  async getAppointment(id: number): Promise<AppointmentResponseDto> {
    const appointment = await this.appointmentRepository.findOne({ id });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return this.mapToResponseDto(appointment);
  }

  /**
   * Cancel appointment
   */
  async cancelAppointment(id: number): Promise<void> {
    const appointment = await this.appointmentRepository.findOne({ id });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    this.em.remove(appointment);
    await this.em.flush();
  }

  /**
   * Get all appointments
   */
  async getAllAppointments(): Promise<AppointmentResponseDto[]> {
    const appointments = await this.appointmentRepository.findAll({
      orderBy: { date: 'ASC', time: 'ASC' },
    });
    return appointments.map((apt) => this.mapToResponseDto(apt));
  }

  private mapToResponseDto(appointment: Appointment): AppointmentResponseDto {
    return {
      id: appointment.id,
      date: TimeUtils.formatDate(appointment.date),
      time: appointment.time,
      customerName: appointment.customerName,
      customerEmail: appointment.customerEmail,
      slotsBooked: appointment.slotsBooked,
      createdAt: appointment.createdAt,
    };
  }
}
