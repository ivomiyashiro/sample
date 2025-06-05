import type {
  AuthResultDTO,
  ErrorResponse,
  SignInDTO,
  SuccessResponse,
} from '@sample/shared';

import AuthBaseApi from './auth-base.api';

import type { ApiResult } from '@/lib/api';
import { Result } from '@/lib/utils';

class SignInApi extends AuthBaseApi {
  constructor() {
    super();
  }

  public async handler(data: SignInDTO): Promise<ApiResult<AuthResultDTO>> {
    try {
      const result = await this.post<SuccessResponse<AuthResultDTO>>(
        '/signin',
        data,
      );

      return Result.success(result);
    } catch (error) {
      return Result.failure(error as ErrorResponse);
    }
  }
}

export const signinApi = new SignInApi();
