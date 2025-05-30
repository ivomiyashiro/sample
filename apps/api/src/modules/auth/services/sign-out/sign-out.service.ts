import { HttpStatus, Injectable } from '@nestjs/common';

import { AppErrorType, ResultVoid } from '@/utils';

import { AuthSupabaseService } from '@/common/services/supabase/services';

@Injectable()
export class SignOutService {
  constructor(private readonly authSupabaseService: AuthSupabaseService) {}

  async handler(): Promise<ResultVoid<AppErrorType>> {
    const result = await this.authSupabaseService.signOut();

    if (result.isFailure) {
      return ResultVoid.failure({
        type: HttpStatus.BAD_REQUEST,
        message: result.error.message ?? 'Failed to sign out',
      });
    }

    return ResultVoid.success();
  }
}
