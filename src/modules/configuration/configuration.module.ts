import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigurationController } from './configuration.controller';
import { ConfigurationService } from './configuration.service';
import { DayOff } from '../../entities/day-off.entity';
import { UnavailableHour } from '../../entities/unavailable-hour.entity';

@Module({
  imports: [MikroOrmModule.forFeature([DayOff, UnavailableHour])],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
