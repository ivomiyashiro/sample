import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { SuccessResponse, PaginatedResponse } from '@sample/shared';

/**
 * Normalizes the success response of the API.
 */
@Injectable()
export class GlobalHttpResponseInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T> | PaginatedResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T> | PaginatedResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data: unknown) => {
        // Check if the response is already a structured response
        if (this.isStructuredResponse(data)) {
          // If it's already structured, just ensure the statusCode and timestamp are correct
          return {
            ...data,
            statusCode: response.statusCode,
            timestamp: new Date().toISOString(),
          } as SuccessResponse<T> | PaginatedResponse<T>;
        }

        // If it's raw data, wrap it in the standard success response format
        return {
          data: data as T,
          statusCode: response.statusCode,
          success: true,
          timestamp: new Date().toISOString(),
        } as SuccessResponse<T>;
      }),
    );
  }

  /**
   * Check if the response is already a structured response
   */
  private isStructuredResponse(
    data: unknown,
  ): data is SuccessResponse<unknown> | PaginatedResponse<unknown> {
    return (
      data !== null &&
      typeof data === 'object' &&
      'statusCode' in data &&
      'success' in data &&
      'timestamp' in data &&
      typeof (data as Record<string, unknown>).statusCode === 'number' &&
      typeof (data as Record<string, unknown>).success === 'boolean' &&
      typeof (data as Record<string, unknown>).timestamp === 'string'
    );
  }
}
