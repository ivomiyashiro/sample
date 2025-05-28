import { Injectable, HttpStatus } from '@nestjs/common';
import { ResultVoid, AppErrorType } from '@/utils';
import { SupabaseService } from '@/modules/supabase/supabase.service';

@Injectable()
export class SignOutService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async handler(accessToken: string): Promise<ResultVoid<AppErrorType>> {
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
