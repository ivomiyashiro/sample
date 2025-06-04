import type {
  AuthResultDTO,
  ErrorResponse,
  SuccessResponse,
} from '@sample/shared';

import type { ApiResult } from '@/lib/api';
import { Result } from '@/lib/utils';

import AuthBaseApi from './auth-base.api';

class RefreshTokenApi extends AuthBaseApi {
  constructor() {
    super();
  }

  public async handler(): Promise<ApiResult<AuthResultDTO>> {
    try {
      const result =
        await this.post<SuccessResponse<AuthResultDTO>>('/refresh');

      return Result.success(result);
    } catch (error) {
      return Result.failure(error as ErrorResponse);
    }
  }
}

export const refreshTokenApi = new RefreshTokenApi();
