import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsInt, Min } from 'class-validator';

export class GetAvailableSlotsDto {
  @ApiProperty({
    description: 'Date to check available slots (YYYY-MM-DD)',
    example: '2024-04-04',
  })
  @IsDateString()
  date!: string;

  @ApiProperty({
    description: 'Number of consecutive slots needed',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  slotsNeeded?: number;
}
