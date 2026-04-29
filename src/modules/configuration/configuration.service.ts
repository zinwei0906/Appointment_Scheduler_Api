import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { DayOff } from '../../entities/day-off.entity';
import { UnavailableHour } from '../../entities/unavailable-hour.entity';
import { CreateDayOffDto, CreateUnavailableHourDto } from './dto';
import { TimeUtils } from '../../common/utils/time.utils';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectRepository(DayOff)
    private readonly dayOffRepository: EntityRepository<DayOff>,
    @InjectRepository(UnavailableHour)
    private readonly unavailableHourRepository: EntityRepository<UnavailableHour>,
  ) {}

  // Helper method to get EntityManager from repository
  private get em(): EntityManager {
    return this.dayOffRepository.getEntityManager();
  }

  // Days Off Management
  async createDayOff(dto: CreateDayOffDto): Promise<DayOff> {
    const date = TimeUtils.parseDate(dto.date);
    const dayOff = new DayOff(date, dto.reason);
    this.em.persist(dayOff);
    await this.em.flush();
    return dayOff;
  }

  async getAllDaysOff(): Promise<DayOff[]> {
    return this.dayOffRepository.findAll({
      orderBy: { date: 'ASC' },
    });
  }

  async deleteDayOff(id: number): Promise<void> {
    const dayOff = await this.dayOffRepository.findOne({ id });
    if (!dayOff) {
      throw new NotFoundException(`Day off with ID ${id} not found`);
    }
    this.em.remove(dayOff);
    await this.em.flush();
  }

  // Unavailable Hours Management
  async createUnavailableHour(
    dto: CreateUnavailableHourDto,
  ): Promise<UnavailableHour> {
    const unavailableHour = new UnavailableHour(
      dto.dayOfWeek,
      dto.startTime,
      dto.endTime,
      dto.reason,
    );
    this.em.persist(unavailableHour);
    await this.em.flush();
    return unavailableHour;
  }

  async getAllUnavailableHours(): Promise<UnavailableHour[]> {
    return this.unavailableHourRepository.findAll({
      orderBy: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async deleteUnavailableHour(id: number): Promise<void> {
    const unavailableHour = await this.unavailableHourRepository.findOne({
      id,
    });
    if (!unavailableHour) {
      throw new NotFoundException(`Unavailable hour with ID ${id} not found`);
    }
    this.em.remove(unavailableHour);
    await this.em.flush();
  }
}
