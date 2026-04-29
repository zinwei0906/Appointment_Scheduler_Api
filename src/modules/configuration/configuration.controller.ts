import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ConfigurationService } from './configuration.service';
import { CreateDayOffDto, CreateUnavailableHourDto } from './dto';
import { DayOff } from '../../entities/day-off.entity';
import { UnavailableHour } from '../../entities/unavailable-hour.entity';

@ApiTags('Configuration')
@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  // Days Off Endpoints
  @Post('days-off')
  @ApiOperation({
    summary: 'Create day off',
    description: 'Mark a specific date as a day off (e.g., public holiday)',
  })
  @ApiResponse({
    status: 201,
    description: 'Day off created successfully',
    type: DayOff,
  })
  async createDayOff(@Body() dto: CreateDayOffDto): Promise<DayOff> {
    return this.configurationService.createDayOff(dto);
  }

  @Get('days-off')
  @ApiOperation({
    summary: 'Get all days off',
    description: 'Retrieve all configured days off',
  })
  @ApiResponse({
    status: 200,
    description: 'List of days off',
    type: [DayOff],
  })
  async getAllDaysOff(): Promise<DayOff[]> {
    return this.configurationService.getAllDaysOff();
  }

  @Delete('days-off/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete day off',
    description: 'Remove a day off configuration',
  })
  @ApiParam({
    name: 'id',
    description: 'Day off ID',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Day off deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Day off not found',
  })
  async deleteDayOff(@Param('id') id: string): Promise<void> {
    return this.configurationService.deleteDayOff(parseInt(id));
  }

  // Unavailable Hours Endpoints
  @Post('unavailable-hours')
  @ApiOperation({
    summary: 'Create unavailable hour',
    description:
      'Set a time range as unavailable for a specific day of week (e.g., lunch break)',
  })
  @ApiResponse({
    status: 201,
    description: 'Unavailable hour created successfully',
    type: UnavailableHour,
  })
  async createUnavailableHour(
    @Body() dto: CreateUnavailableHourDto,
  ): Promise<UnavailableHour> {
    return this.configurationService.createUnavailableHour(dto);
  }

  @Get('unavailable-hours')
  @ApiOperation({
    summary: 'Get all unavailable hours',
    description: 'Retrieve all configured unavailable hours',
  })
  @ApiResponse({
    status: 200,
    description: 'List of unavailable hours',
    type: [UnavailableHour],
  })
  async getAllUnavailableHours(): Promise<UnavailableHour[]> {
    return this.configurationService.getAllUnavailableHours();
  }

  @Delete('unavailable-hours/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete unavailable hour',
    description: 'Remove an unavailable hour configuration',
  })
  @ApiParam({
    name: 'id',
    description: 'Unavailable hour ID',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Unavailable hour deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Unavailable hour not found',
  })
  async deleteUnavailableHour(@Param('id') id: string): Promise<void> {
    return this.configurationService.deleteUnavailableHour(parseInt(id));
  }
}
