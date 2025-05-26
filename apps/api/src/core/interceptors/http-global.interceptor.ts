import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { SuccessResponse } from '@sample/shared';

@Injectable()
export class HttpGlobalInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data: T) => {
        return {
          data,
          statusCode: response.statusCode,
          success: true,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
