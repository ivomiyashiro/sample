import { HttpStatus, Injectable } from '@nestjs/common';

import { OAuthProviderEnum, SignInDTO, SignUpDTO } from '@sample/shared';

import { AppErrorType, ResultVoid } from '@/utils';
import { Result } from '@/utils';

import { BaseSupabaseService } from './base-supabase.service';

import { Session, User } from '@supabase/supabase-js';

@Injectable()
export class AuthSupabaseService extends BaseSupabaseService {
  constructor() {
    super();
  }

  async signUp(
    signUpDto: SignUpDTO,
  ): Promise<Result<{ user: User; session: Session }, AppErrorType>> {
    const { data, error } = await this.getAdminClient().auth.signUp(signUpDto);

    if (error) {
      return Result.failure({
        type: HttpStatus.BAD_REQUEST,
        message: error.message ?? 'Failed to create user',
      });
    }

    if (data.user === null || data.session === null) {
      return Result.failure({
        type: HttpStatus.BAD_REQUEST,
        message: 'Failed to create user',
      });
    }

    return Result.success({
      user: data.user,
      session: data.session,
    });
  }

  async signIn(
    signInDto: SignInDTO,
  ): Promise<Result<{ user: User; session: Session }, AppErrorType>> {
    const { data, error } =
      await this.getAdminClient().auth.signInWithPassword(signInDto);

    if (error) {
      return Result.failure({
        type: HttpStatus.BAD_REQUEST,
        message: error.message ?? 'Failed to sign in',
      });
    }

    if (data.user === null || data.session === null) {
      return Result.failure({
        type: HttpStatus.BAD_REQUEST,
        message: 'Failed to sign in',
      });
    }

    return Result.success({
      user: data.user,
      session: data.session,
    });
  }

  async signOut(): Promise<ResultVoid<AppErrorType>> {
    const { error } = await this.getAdminClient().auth.signOut();

    if (error) {
      return ResultVoid.failure({
        type: HttpStatus.BAD_REQUEST,
        message: error.message ?? 'Failed to sign out',
      });
    }

    return ResultVoid.success();
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<Result<{ user: User; session: Session }, AppErrorType>> {
    const { data, error } = await this.getAdminClient().auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      return Result.failure({
        type: HttpStatus.BAD_REQUEST,
        message: error.message ?? 'Failed to refresh token',
      });
    }

    if (data.user === null || data.session === null) {
      return Result.failure({
        type: HttpStatus.BAD_REQUEST,
        message: 'Failed to refresh token',
      });
    }

    return Result.success({
      user: data.user,
      session: data.session,
    });
  }

  async signInWithOAuth(
    provider: OAuthProviderEnum,
  ): Promise<Result<{ url: string }, AppErrorType>> {
    const { data, error } = await this.getAdminClient().auth.signInWithOAuth({
      provider,
    });

    if (error) {
      return Result.failure({
        type: HttpStatus.BAD_REQUEST,
        message: error.message ?? 'Failed to sign in with OAuth',
      });
    }

    if (data.url === null) {
      return Result.failure({
        type: HttpStatus.BAD_REQUEST,
        message: 'Failed to sign in with OAuth',
      });
    }

    return Result.success({
      url: data.url,
    });
  }
}
