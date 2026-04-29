import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import {
  CreateAppointmentDto,
  GetAvailableSlotsDto,
  AvailableSlotResponseDto,
  AppointmentResponseDto,
} from './dto';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('available-slots')
  @ApiOperation({
    summary: 'Get available appointment slots',
    description: 'Retrieve available time slots for a specific date',
  })
  @ApiResponse({
    status: 200,
    description: 'List of available slots',
    type: [AvailableSlotResponseDto],
  })
  @ApiQuery({
    name: 'date',
    description: 'Date to check (YYYY-MM-DD)',
    example: '2024-04-04',
  })
  @ApiQuery({
    name: 'slotsNeeded',
    description: 'Number of consecutive slots needed',
    required: false,
    example: 1,
  })
  async getAvailableSlots(
    @Query() dto: GetAvailableSlotsDto,
  ): Promise<AvailableSlotResponseDto[]> {
    return this.appointmentsService.getAvailableSlots(dto);
  }

  @Post()
  @ApiOperation({
    summary: 'Book an appointment',
    description: 'Create a new appointment for the specified date and time',
  })
  @ApiResponse({
    status: 201,
    description: 'Appointment created successfully',
    type: AppointmentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request or slot not available',
  })
  @ApiResponse({
    status: 409,
    description: 'Slot already booked (conflict)',
  })
  async createAppointment(
    @Body() dto: CreateAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    return this.appointmentsService.createAppointment(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all appointments',
    description: 'Retrieve all booked appointments',
  })
  @ApiResponse({
    status: 200,
    description: 'List of appointments',
    type: [AppointmentResponseDto],
  })
  async getAllAppointments(): Promise<AppointmentResponseDto[]> {
    return this.appointmentsService.getAllAppointments();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get appointment by ID',
    description: 'Retrieve a specific appointment by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Appointment ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Appointment details',
    type: AppointmentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found',
  })
  async getAppointment(
    @Param('id') id: string,
  ): Promise<AppointmentResponseDto> {
    return this.appointmentsService.getAppointment(parseInt(id));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Cancel appointment',
    description: 'Cancel an existing appointment',
  })
  @ApiParam({
    name: 'id',
    description: 'Appointment ID',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Appointment cancelled successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found',
  })
  async cancelAppointment(@Param('id') id: string): Promise<void> {
    return this.appointmentsService.cancelAppointment(parseInt(id));
  }
}
