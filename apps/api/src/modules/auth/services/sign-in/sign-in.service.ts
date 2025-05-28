import { Injectable, HttpStatus } from '@nestjs/common';
import { AuthResponse } from '@supabase/supabase-js';

import { Result, AppErrorType } from '@/utils';
import { SupabaseService } from '@/modules/supabase/supabase.service';

import { AuthResultDTO, SignInDto } from '@/modules/auth/dtos';
import { UserMapper, SessionMapper } from '@/modules/auth/utils';

@Injectable()
export class SignInService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async handler(
    signInDto: SignInDto,
  ): Promise<Result<AuthResultDTO, AppErrorType>> {
    const supabase = this.supabaseService.getClient();

    const { data, error }: AuthResponse =
      await supabase.auth.signInWithPassword({
        email: signInDto.email,
        password: signInDto.password,
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
        message: 'Invalid credentials',
      });
    }

    return Result.success({
      user: UserMapper.mapToUserDTO(data.user),
      session: SessionMapper.mapToSessionDTO(data.session),
    });
  }
}
