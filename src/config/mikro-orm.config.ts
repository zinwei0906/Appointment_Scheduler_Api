import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { ConfigService } from '@nestjs/config';
import { PostgreSqlDriver } from 'node_modules/@mikro-orm/postgresql/PostgreSqlDriver';

export const getMikroOrmConfig = (
  configService: ConfigService,
): MikroOrmModuleOptions => ({
  driver: PostgreSqlDriver,
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  user: configService.get<string>('DB_USER', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'wei0906'),
  dbName: configService.get<string>('DB_NAME', 'appointment_dev'),
  entities: ['./dist/entities/**/*.entity.js'],
  entitiesTs: ['./src/entities/**/*.entity.ts'],
  debug: configService.get<string>('NODE_ENV') === 'development',
  allowGlobalContext: true,
  migrations: {
    path: './src/migrations',
    pathTs: './src/migrations',
  },
});
