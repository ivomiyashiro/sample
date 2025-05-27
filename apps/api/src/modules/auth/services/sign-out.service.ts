import { Injectable, HttpStatus } from '@nestjs/common';

import { ResultVoid } from '@/utils';
import { AppErrorType } from '@/utils';

import { SupabaseService } from './supabase.service';

@Injectable()
export class SignOutService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async handle(accessToken: string): Promise<ResultVoid<AppErrorType>> {
    const supabase = this.supabaseService.getClientWithAuth(accessToken);

    const { error } = await supabase.auth.signOut();

    if (error) {
      return ResultVoid.failure({
        type: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }

    return ResultVoid.success();
  }
}
