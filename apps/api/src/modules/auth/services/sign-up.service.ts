import { Injectable, HttpStatus } from '@nestjs/common';
import { AuthResponse } from '@supabase/supabase-js';

import { Result, AppErrorType } from '@/utils';

import { signUpValidator } from '../validators';
import { SupabaseService } from './supabase.service';
import { SignUpDto, AuthResultDTO } from '../dtos';
import { UserMapper, SessionMapper } from '../utils';

@Injectable()
export class SignUpService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async handle(
    signUpDto: SignUpDto,
  ): Promise<Result<AuthResultDTO, AppErrorType>> {
    const validationResult = signUpValidator.safeParse(signUpDto);

    if (!validationResult.success) {
      return Result.failure({
        type: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const supabase = this.supabaseService.getClient();

    const { data, error }: AuthResponse = await supabase.auth.signUp({
      email: signUpDto.email,
      password: signUpDto.password,
    });

    if (error) {
      return Result.failure({
        type: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }

    if (!data.user || !data.session) {
      return Result.failure({
        type: HttpStatus.BAD_REQUEST,
        message: 'Failed to create user',
      });
    }

    return Result.success({
      user: UserMapper.mapToUserDTO(data.user),
      session: SessionMapper.mapToSessionDTO(data.session),
    });
  }
}
