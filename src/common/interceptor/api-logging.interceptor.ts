import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiLoggingService } from '../services/api-logging.service';

@Injectable()
export class ApiLoggingInterceptor implements NestInterceptor {
  constructor(private readonly apiLoggingService: ApiLoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();

    const apiKey = request.apiKey || 'anonymous';
    const method = request.method;
    const url = request.url;
    const requestHeaders = this.sanitizeHeaders(request.headers);
    const requestBody = request.body;
    const requestQuery = request.query;
    const ipAddress = request.ip || request.connection.remoteAddress;
    const userAgent = request.headers['user-agent'];
    const language = request.headers['accept-language'] || 'en';

    return next.handle().pipe(
      tap((data) => {
        const responseTime = Date.now() - startTime;

        // ✅ DO NOT block response, but ensure promise runs
        void this.apiLoggingService.logRequest({
          apiKey,
          method,
          url,
          requestHeaders,
          requestBody,
          requestQuery,
          statusCode: response.statusCode,
          responseBody: data,
          responseTime,
          ipAddress,
          userAgent,
          language,
        });
      }),
    );
  }

  private sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };

    delete sanitized['x-api-key'];
    delete sanitized['api-key'];
    delete sanitized['authorization'];
    delete sanitized['cookie'];

    return sanitized;
  }
}
