import { Injectable, HttpStatus } from '@nestjs/common';

import { Result, AppErrorType } from '@/utils';
import { AuthSupabaseService } from '@/common/services/supabase/services';

import { AuthResultDTO, SignInDto } from '@/modules/auth/dtos';
import { UserMapper, SessionMapper } from '@/modules/auth/utils';

@Injectable()
export class SignInService {
  constructor(private readonly authSupabaseService: AuthSupabaseService) {}

  async handler(
    signInDto: SignInDto,
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
