import { Module, Global } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { ApiKey } from '../entities/api-key.entity';
import { ApiLog } from '../entities/api-log.entity';
import { ApiResponseCode } from '../entities/api-response-code.entity';

import { ResponseService } from './services/response.service';
import { ApiLoggingService } from './services/api-logging.service';
import { ApiKeyGuard } from './guards/api-key.guard';
import { ApiKeyService } from './services/api-key.service';
import { ResponseCodeLoaderService } from './services/response-code-loader.service';

@Global()
@Module({
  imports: [MikroOrmModule.forFeature([ApiKey, ApiLog, ApiResponseCode])],
  providers: [
    ResponseService,
    ApiLoggingService,
    ApiKeyGuard,
    ApiKeyService,
    ResponseCodeLoaderService,
  ],
  exports: [ResponseService, ApiLoggingService, ApiKeyGuard, ApiKeyService],
})
export class CommonModule {}
