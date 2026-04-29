import { ApiProperty } from '@nestjs/swagger';

export class AvailableSlotResponseDto {
  @ApiProperty({
    description: 'Date of the slot',
    example: '2024-04-04',
  })
  date!: string;

  @ApiProperty({
    description: 'Time of the slot',
    example: '10:00',
  })
  time!: string;

  @ApiProperty({
    description: 'Number of available slots',
    example: 1,
  })
  available_slots!: number;
}

export class AppointmentResponseDto {
  @ApiProperty({
    description: 'Appointment ID',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'Appointment date',
    example: '2024-04-04',
  })
  date!: string;

  @ApiProperty({
    description: 'Appointment time',
    example: '10:00',
  })
  time!: string;

  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
    required: false,
  })
  customerName?: string;

  @ApiProperty({
    description: 'Customer email',
    example: 'john@example.com',
    required: false,
  })
  customerEmail?: string;

  @ApiProperty({
    description: 'Number of slots booked',
    example: 1,
  })
  slotsBooked!: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-04-04T10:00:00.000Z',
  })
  createdAt!: Date;
}
