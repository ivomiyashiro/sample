import type { ErrorResponse, SuccessResponse } from '@sample/shared';

import AuthBaseApi from './auth-base.api';

import type { ApiResult } from '@/lib/api';
import { Result } from '@/lib/utils';

class SignOutApi extends AuthBaseApi {
  constructor() {
    super();
  }

  public async handler(): Promise<ApiResult<void>> {
    try {
      const result = await this.post<SuccessResponse<void>>('/signout');

      return Result.success(result);
    } catch (error) {
      return Result.failure(error as ErrorResponse);
    }
  }
}

export const signOutApi = new SignOutApi();
