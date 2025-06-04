import type {
  ErrorResponse,
  PaginatedResponse,
  SuccessResponse,
} from '@sample/shared';
import type { Result } from '@/lib/utils';

export type ApiResult<T> = Result<SuccessResponse<T>, ErrorResponse>;
export type ApiPaginatedResult<T> = Result<PaginatedResponse<T>, ErrorResponse>;
export type ApiVoidResult = Result<void, ErrorResponse>;
