import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { getMikroOrmConfig } from './config/mikro-orm.config';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Setup MikroORM with PostgreSQL
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getMikroOrmConfig(configService),
    }),

    // Feature modules
    AppointmentsModule,
    ConfigurationModule,
  ],
})
export class AppModule {}
