import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiHeader,
  ApiSecurity,
} from '@nestjs/swagger';

import { ConfigurationService } from './configuration.service';
import { CreateDayOffDto, CreateUnavailableHourDto } from './dto';

import { DayOff } from '../../entities/day-off.entity';
import { UnavailableHour } from '../../entities/unavailable-hour.entity';

import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { ResponseService } from '../../common/services/response.service';
import { Language } from '../../common/decorators/language.decorator';
import { ApiResponseDto } from '../../common/interfaces/api-response.dto';

@ApiTags('Configuration')
@Controller('configuration')
@UseGuards(ApiKeyGuard)
@ApiSecurity('api-key')
@ApiHeader({
  name: 'x-api-key',
  required: true,
  example: 'test-api-key-12345',
})
@ApiHeader({
  name: 'Accept-Language',
  required: false,
  example: 'en',
})
export class ConfigurationController {
  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly responseService: ResponseService,
  ) {}

  // =========================
  // DAY OFF
  // =========================

  @Post('days-off')
  @ApiOperation({
    summary: 'Create day off',
    description: 'Mark a specific date as unavailable (holiday / leave)',
  })
  @ApiResponse({
    status: 201,
    description: 'Day off created successfully',
    type: DayOff,
  })
  async createDayOff(
    @Body() dto: CreateDayOffDto,
    @Language() language: string,
  ): Promise<ApiResponseDto<DayOff>> {
    const result = await this.configurationService.createDayOff(dto);

    return this.responseService.buildResponse(
      'DAY_OFF_CREATED',
      result,
      language,
    );
  }

  @Get('days-off')
  @ApiOperation({
    summary: 'Get all days off',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all days off',
    type: [DayOff],
  })
  async getAllDaysOff(
    @Language() language: string,
  ): Promise<ApiResponseDto<DayOff[]>> {
    const result = await this.configurationService.getAllDaysOff();

    return this.responseService.buildResponse('SUCCESS', result, language);
  }

  @Delete('days-off/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete day off',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  async deleteDayOff(
    @Param('id') id: string,
    @Language() language: string,
  ): Promise<ApiResponseDto<void>> {
    await this.configurationService.deleteDayOff(parseInt(id));

    return this.responseService.buildResponse(
      'DAY_OFF_DELETED',
      undefined,
      language,
    );
  }

  // =========================
  // UNAVAILABLE HOURS
  // =========================

  @Post('unavailable-hours')
  @ApiOperation({
    summary: 'Create unavailable hour',
    description: 'Block a time range for specific weekdays (e.g. lunch break)',
  })
  @ApiResponse({
    status: 201,
    description: 'Unavailable hour created successfully',
    type: UnavailableHour,
  })
  async createUnavailableHour(
    @Body() dto: CreateUnavailableHourDto,
    @Language() language: string,
  ): Promise<ApiResponseDto<UnavailableHour>> {
    const result = await this.configurationService.createUnavailableHour(dto);

    return this.responseService.buildResponse(
      'UNAVAILABLE_HOUR_CREATED',
      result,
      language,
    );
  }

  @Get('unavailable-hours')
  @ApiOperation({
    summary: 'Get all unavailable hours',
  })
  @ApiResponse({
    status: 200,
    description: 'List of unavailable hours',
    type: [UnavailableHour],
  })
  async getAllUnavailableHours(
    @Language() language: string,
  ): Promise<ApiResponseDto<UnavailableHour[]>> {
    const result = await this.configurationService.getAllUnavailableHours();

    return this.responseService.buildResponse('SUCCESS', result, language);
  }

  @Delete('unavailable-hours/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete unavailable hour',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  async deleteUnavailableHour(
    @Param('id') id: string,
    @Language() language: string,
  ): Promise<ApiResponseDto<void>> {
    await this.configurationService.deleteUnavailableHour(parseInt(id));

    return this.responseService.buildResponse(
      'UNAVAILABLE_HOUR_DELETED',
      undefined,
      language,
    );
  }
}
