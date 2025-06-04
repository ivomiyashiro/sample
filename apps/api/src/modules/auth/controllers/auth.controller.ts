import { Request, Response } from 'express';

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';

import {
  OAuthProviderEnum,
  SignInDTO,
  SignUpDTO,
  UserDTO,
} from '@sample/shared';

import { config } from '@/config';
import { AppException } from '@/utils';

import { Public, User } from '@/common/decorators';

import {
  RefreshTokenService,
  SignInService,
  SignInWithOAuthService,
  SignOutService,
  SignUpService,
} from '../services';

interface RequestWithCookies extends Request {
  cookies: {
    refreshToken?: string;
    [key: string]: string | undefined;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signUpService: SignUpService,
    private readonly signInService: SignInService,
    private readonly signInWithOAuthService: SignInWithOAuthService,
    private readonly signOutService: SignOutService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @Public()
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDTO) {
    const result = await this.signUpService.handler(signUpDto);

    return result.match(
      (value) => value,
      (error) => {
        throw new AppException(error);
      },
    );
  }

  @Public()
  @Post('signin')
  async signIn(
    @Body() signInDto: SignInDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.signInService.handler(signInDto);

    return result.match(
      (value) => {
        response.cookie(config().JWT_NAME, value.session.refreshToken, {
          httpOnly: true,
          sameSite: 'strict',
          secure: config().NODE_ENV === 'production',
          maxAge: config().JWT_EXPIRATION_TIME,
        });

        return {
          user: value.user,
          session: {
            accessToken: value.session.accessToken,
            expiresAt: value.session.expiresAt,
          },
        };
      },
      (error) => {
        throw new AppException(error);
      },
    );
  }

  @Public()
  @Post('signin/github')
  async signInWithGithub() {
    const result = await this.signInWithOAuthService.handler(
      OAuthProviderEnum.GITHUB,
    );

    return result.match(
      (value) => {
        return {
          message: 'OAuth URL generated successfully',
          url: value.url,
        };
      },
      (error) => {
        throw new AppException(error);
      },
    );
  }

  @Post('signout')
  async signOut(@Res({ passthrough: true }) response: Response) {
    const result = await this.signOutService.handler();

    return result.match(
      () => {
        response.clearCookie(config().JWT_NAME);
        return { message: 'Successfully signed out' };
      },
      (error) => {
        throw new AppException(error);
      },
    );
  }

  @Public()
  @Post('refresh')
  async refreshToken(
    @Req() request: RequestWithCookies,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies[config().JWT_NAME];

    if (!refreshToken) {
      throw new AppException({
        type: HttpStatus.BAD_REQUEST,
        message: 'Refresh token not found',
      });
    }

    const result = await this.refreshTokenService.handler(refreshToken);

    return result.match(
      (value) => {
        response.cookie(config().JWT_NAME, value.session.refreshToken, {
          httpOnly: true,
          sameSite: 'strict',
          secure: config().NODE_ENV === 'production',
          maxAge: config().JWT_EXPIRATION_TIME,
        });

        return {
          user: value.user,
          session: {
            accessToken: value.session.accessToken,
            expiresAt: value.session.expiresAt,
          },
        };
      },
      (error) => {
        throw new AppException(error);
      },
    );
  }

  @Get('me')
  getCurrentUser(@User() user: UserDTO) {
    return user;
  }

  @Public()
  @Get('callback')
  handleOAuthCallback() {
    // This endpoint handles the OAuth callback from GitHub
    // The frontend should handle the actual token exchange
    return {
      message: 'OAuth callback received. Handle token exchange on frontend.',
    };
  }
}
