import { Injectable } from '@nestjs/common';
import { ApiResponseCode } from '../../entities/api-response-code.entity';

@Injectable()
export class ResponseService {
  private responseCodeCache = new Map<string, ApiResponseCode>();

  constructor() {
    // no DB injection here
  }

  setCodes(codes: ApiResponseCode[]) {
    codes.forEach((c) => this.responseCodeCache.set(c.code, c));
  }

  getMessage(code: string, language = 'en'): string {
    const responseCode = this.responseCodeCache.get(code);

    if (!responseCode) return `Unknown response code: ${code}`;

    const map: any = {
      en: 'messageEn',
      ms: 'messageMs',
      zh: 'messageZh',
    };

    const field = map[language] || 'messageEn';

    return responseCode[field] || responseCode.messageEn;
  }

  buildResponse(code: string, data?: any, language = 'en') {
    return {
      code,
      message: this.getMessage(code, language),
      data,
      timestamp: new Date().toISOString(),
    };
  }

  buildErrorResponse(code: string, language = 'en', error?: any) {
    return {
      code,
      message: this.getMessage(code, language),
      data: error,
      timestamp: new Date().toISOString(),
    };
  }
}
