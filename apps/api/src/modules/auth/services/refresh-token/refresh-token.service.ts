import { Injectable, HttpStatus } from '@nestjs/common';
import { AuthResponse } from '@supabase/supabase-js';

import { Result } from '@/utils';
import { AppErrorType } from '@/utils';

import { SupabaseService } from '../../../supabase/supabase.service';
import { AuthResultDTO } from '../../dtos';
import { UserMapper, SessionMapper } from '../../utils';
import { refreshTokenValidator } from './refresh-token.validator';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly supabaseService: SupabaseService) {}

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

    const supabase = this.supabaseService.getClient();

    const { data, error }: AuthResponse = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      return Result.failure({
        type: HttpStatus.UNAUTHORIZED,
        message: error.message,
      });
    }

    if (!data.user || !data.session) {
      return Result.failure({
        type: HttpStatus.UNAUTHORIZED,
        message: 'Failed to refresh token',
      });
    }

    return Result.success({
      user: UserMapper.mapToUserDTO(data.user),
      session: SessionMapper.mapToSessionDTO(data.session),
    });
  }
}
