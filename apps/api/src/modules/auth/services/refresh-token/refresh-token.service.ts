import { Injectable, HttpStatus } from '@nestjs/common';
import { AuthResultDTO } from '@sample/shared';

import { Result } from '@/utils';
import { AppErrorType } from '@/utils';
import { AuthSupabaseService } from '@/common/services/supabase/services';

import { UserMapper, SessionMapper } from '../../utils';
import { refreshTokenValidator } from './refresh-token.validator';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly authSupabaseService: AuthSupabaseService) {}

  async handler(
    refreshToken: string,
  ): Promise<Result<AuthResultDTO, AppErrorType>> {
    const { success, error: validationError } = refreshTokenValidator.safeParse(
      {
        refreshToken,
      },
    );

    if (!success) {
      return Result.failure({
        type: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        details: validationError.flatten().fieldErrors,
      });
    }

    const result = await this.authSupabaseService.refreshToken(refreshToken);

    if (result.isFailure) {
      return Result.failure({
        type: HttpStatus.UNAUTHORIZED,
        message: result.error.message ?? 'Failed to refresh token',
      });
    }

    if (!result.value.user || !result.value.session) {
      return Result.failure({
        type: HttpStatus.UNAUTHORIZED,
        message: 'Failed to refresh token',
      });
    }

    return Result.success({
      user: UserMapper.mapToUserDTO(result.value.user),
      session: SessionMapper.mapToSessionDTO(result.value.session),
    });
  }
}
