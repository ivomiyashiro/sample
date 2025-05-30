import { HttpStatus, Injectable } from '@nestjs/common';

import { AuthResultDTO, SignUpDTO } from '@sample/shared';

import { AppErrorType, Result } from '@/utils';

import { AuthSupabaseService } from '@/common/services/supabase/services';
import { SessionMapper, UserMapper } from '@/modules/auth/utils';

import { signUpValidator } from './sign-up.validator';

@Injectable()
export class SignUpService {
  constructor(private readonly authSupabaseService: AuthSupabaseService) {}

  async handler(
    signUpDto: SignUpDTO,
  ): Promise<Result<AuthResultDTO, AppErrorType>> {
    const validationResult = signUpValidator.safeParse(signUpDto);

    if (!validationResult.success) {
      return Result.failure({
        type: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const result = await this.authSupabaseService.signUp(signUpDto);

    if (result.isFailure) {
      return Result.failure({
        type: HttpStatus.BAD_REQUEST,
        message: result.error.message ?? 'Failed to create user',
      });
    }

    if (!result.value.user || !result.value.session) {
      return Result.failure({
        type: HttpStatus.BAD_REQUEST,
        message: 'Failed to create user',
      });
    }

    return Result.success({
      user: UserMapper.mapToUserDTO(result.value.user),
      session: SessionMapper.mapToSessionDTO(result.value.session),
    });
  }
}
