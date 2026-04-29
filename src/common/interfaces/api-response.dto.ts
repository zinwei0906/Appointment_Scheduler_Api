export interface ApiResponseDto<T = any> {
  code: string;
  message: string;
  data?: T;
  timestamp: string;
}
