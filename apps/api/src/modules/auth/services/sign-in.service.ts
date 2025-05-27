import { Injectable, HttpStatus } from '@nestjs/common';
import { AuthResponse } from '@supabase/supabase-js';

import { Result, AppErrorType } from '@/utils';

import { SupabaseService } from './supabase.service';
import { SignInDto, AuthResultDTO } from '../dtos';
import { UserMapper, SessionMapper } from '../utils';

@Injectable()
export class SignInService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async handle(
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
