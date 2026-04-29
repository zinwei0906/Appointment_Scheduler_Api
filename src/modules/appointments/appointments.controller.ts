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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiHeader,
  ApiSecurity,
} from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import {
  CreateAppointmentDto,
  GetAvailableSlotsDto,
  AvailableSlotResponseDto,
  AppointmentResponseDto,
} from './dto';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { ResponseService } from '../../common/services/response.service';
import { Language } from '../../common/decorators/language.decorator';
import { ApiResponseDto } from '../../common/interfaces/api-response.dto';

@ApiTags('Appointments')
@Controller('appointments')
@UseGuards(ApiKeyGuard)
@ApiSecurity('api-key')
@ApiHeader({
  name: 'x-api-key',
  description: 'API Key for authentication',
  required: true,
  example: 'test-api-key-12345',
})
@ApiHeader({
  name: 'Accept-Language',
  description: 'Language preference (en, ms, zh)',
  required: false,
  example: 'en',
})
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly responseService: ResponseService,
  ) {}

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
    example: '2026-04-29',
  })
  @ApiQuery({
    name: 'slotsNeeded',
    description: 'Number of consecutive slots needed',
    required: false,
    example: 1,
  })
  async getAvailableSlots(
    @Query() dto: GetAvailableSlotsDto,
    @Language() language: string,
  ): Promise<ApiResponseDto<AvailableSlotResponseDto[]>> {
    const slots = await this.appointmentsService.getAvailableSlots(dto);
    return this.responseService.buildResponse('SUCCESS', slots, language);
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
    @Language() language: string,
  ): Promise<ApiResponseDto<AppointmentResponseDto>> {
    const appointment = await this.appointmentsService.createAppointment(dto);
    return this.responseService.buildResponse(
      'APPOINTMENT_CREATED',
      appointment,
      language,
    );
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
  async getAllAppointments(
    @Language() language: string,
  ): Promise<ApiResponseDto<AppointmentResponseDto[]>> {
    const appointments = await this.appointmentsService.getAllAppointments();
    return this.responseService.buildResponse(
      'SUCCESS',
      appointments,
      language,
    );
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
    @Language() language: string,
  ): Promise<ApiResponseDto<AppointmentResponseDto>> {
    const appointment = await this.appointmentsService.getAppointment(
      parseInt(id),
    );
    return this.responseService.buildResponse('SUCCESS', appointment, language);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
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
    status: 200,
    description: 'Appointment cancelled successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found',
  })
  async cancelAppointment(
    @Param('id') id: string,
    @Language() language: string,
  ): Promise<ApiResponseDto<void>> {
    await this.appointmentsService.cancelAppointment(parseInt(id));
    return this.responseService.buildResponse(
      'APPOINTMENT_CANCELLED',
      undefined,
      language,
    );
  }
}
