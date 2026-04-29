import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to extract language from Accept-Language header
 * Usage: @Language() language: string
 */
export const Language = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const language = request.headers['accept-language'] || 'en';

    // Extract first language code (e.g., "en-US,en;q=0.9" -> "en")
    const primaryLanguage = language.split(',')[0].split('-')[0].toLowerCase();

    // Validate supported languages
    const supportedLanguages = ['en', 'ms', 'zh'];
    return supportedLanguages.includes(primaryLanguage)
      ? primaryLanguage
      : 'en';
  },
);
