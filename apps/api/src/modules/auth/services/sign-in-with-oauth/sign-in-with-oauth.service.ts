import { HttpStatus, Injectable } from '@nestjs/common';

import { config } from '@/config';
import { AppErrorType, Result } from '@/utils';

import { SupabaseService } from '@/modules/supabase/supabase.service';
import { OAuthSignInResult, SignInProviderEnum } from '@/modules/auth/dtos';

/**
 * Service for handling OAuth sign-in flows with external providers
 *
 * Flow:
 * 1. Frontend calls POST /auth/signin/github
 * 2. This service generates an OAuth authorization URL
 * 3. Frontend redirects user to the returned URL
 * 4. User authorizes on GitHub
 * 5. GitHub redirects back to the configured callback URL
 * 6. Frontend handles the callback and exchanges code for tokens
 */
@Injectable()
export class SignInWithOAuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async handler(
    provider: SignInProviderEnum,
  ): Promise<Result<OAuthSignInResult, AppErrorType>> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${config().FRONTEND_URL}/auth/callback`,
      },
    });

    if (error) {
      return Result.failure({
        type: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }

    if (!data.url) {
      return Result.failure({
        type: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to generate OAuth URL',
      });
    }

    return Result.success({ url: data.url });
  }
}
