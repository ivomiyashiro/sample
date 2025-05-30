import { HttpStatus, Injectable } from '@nestjs/common';

import { AuthResultDTO, SignInDTO } from '@sample/shared';

import { AppErrorType, Result } from '@/utils';

import { AuthSupabaseService } from '@/common/services/supabase/services';
import { SessionMapper, UserMapper } from '@/modules/auth/utils';

@Injectable()
export class SignInService {
  constructor(private readonly authSupabaseService: AuthSupabaseService) {}

  async handler(
    signInDto: SignInDTO,
  ): Promise<Result<AuthResultDTO, AppErrorType>> {
    const result = await this.authSupabaseService.signIn(signInDto);

    if (result.isFailure) {
      return Result.failure({
        type: HttpStatus.UNAUTHORIZED,
        message: result.error.message ?? 'Invalid credentials',
      });
    }

    if (!result.value.user || !result.value.session) {
      return Result.failure({
        type: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials',
      });
    }

    return Result.success({
      user: UserMapper.mapToUserDTO(result.value.user),
      session: SessionMapper.mapToSessionDTO(result.value.session),
    });
  }
}
