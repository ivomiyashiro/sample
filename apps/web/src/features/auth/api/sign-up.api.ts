import type { ErrorResponse, SignUpDTO, SuccessResponse } from '@sample/shared';

import type { ApiVoidResult } from '@/lib/api';
import { Result } from '@/lib/utils';

import AuthBaseApi from './auth-base.api';

class SignUpApi extends AuthBaseApi {
  constructor() {
    super();
  }

  public async handler(data: SignUpDTO): Promise<ApiVoidResult> {
    try {
      await this.post<SuccessResponse<void>>('/signup', data);

      return Result.success(undefined);
    } catch (error) {
      return Result.failure(error as ErrorResponse);
    }
  }
}

export const signUpApi = new SignUpApi();
