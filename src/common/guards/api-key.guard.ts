import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { ResponseService } from '../services/response.service';
import { ApiKeyService } from '../services/api-key.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly responseService: ResponseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const apiKey = request.headers['x-api-key'] || request.headers['api-key'];

    const language = request.headers['accept-language'] || 'en';

    if (!apiKey) {
      throw new UnauthorizedException(
        this.responseService.buildErrorResponse('INVALID_API_KEY', language),
      );
    }

    const keyRecord = await this.apiKeyService.findByKey(apiKey);

    if (!keyRecord || !keyRecord.isActive) {
      throw new UnauthorizedException(
        this.responseService.buildErrorResponse('INVALID_API_KEY', language),
      );
    }

    if (keyRecord.expiresAt && keyRecord.expiresAt < new Date()) {
      throw new UnauthorizedException(
        this.responseService.buildErrorResponse('API_KEY_EXPIRED', language),
      );
    }

    await this.apiKeyService.updateUsage(keyRecord);

    request.apiKey = keyRecord.keyValue;
    request.apiKeyName = keyRecord.name;

    return true;
  }
}
