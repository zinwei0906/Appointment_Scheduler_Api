import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsString,
  IsEmail,
  IsOptional,
  Matches,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Appointment date (YYYY-MM-DD)',
    example: '2024-04-04',
  })
  @IsDateString()
  date!: string;

  @ApiProperty({
    description: 'Appointment time (HH:mm)',
    example: '10:00',
  })
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in HH:mm format',
  })
  time!: string;

  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiProperty({
    description: 'Customer email',
    example: 'john@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @ApiProperty({
    description: 'Customer phone',
    example: '+60123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiProperty({
    description: 'Number of consecutive slots to book',
    example: 1,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  slotsBooked?: number;
}
