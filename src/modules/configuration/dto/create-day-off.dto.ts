import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, IsOptional } from 'class-validator';

export class CreateDayOffDto {
  @ApiProperty({
    description: 'Date to mark as day off (YYYY-MM-DD)',
    example: '2026-12-25',
  })
  @IsDateString()
  date!: string;

  @ApiProperty({
    description: 'Reason for day off',
    example: 'Christmas Day',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
