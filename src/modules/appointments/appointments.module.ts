import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Appointment } from '../../entities/appointment.entity';
import { DayOff } from '../../entities/day-off.entity';
import { UnavailableHour } from '../../entities/unavailable-hour.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Appointment, DayOff, UnavailableHour])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
