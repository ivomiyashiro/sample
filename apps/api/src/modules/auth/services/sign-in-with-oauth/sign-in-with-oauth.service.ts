import { HttpStatus, Injectable } from '@nestjs/common';
import { OAuthProviderEnum, OAuthSignInResult } from '@sample/shared';

import { AppErrorType, Result } from '@/utils';

import { AuthSupabaseService } from '@/common/services/supabase/services';

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
  constructor(private readonly authSupabaseService: AuthSupabaseService) {}

  async handler(
    provider: OAuthProviderEnum,
  ): Promise<Result<OAuthSignInResult, AppErrorType>> {
    const result = await this.authSupabaseService.signInWithOAuth(provider);

    if (result.isFailure) {
      return Result.failure({
        type: HttpStatus.BAD_REQUEST,
        message: result.error.message ?? 'Failed to generate OAuth URL',
      });
    }

    if (!result.value.url) {
      return Result.failure({
        type: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to generate OAuth URL',
      });
    }

    return Result.success({ url: result.value.url });
  }
}
