import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  Res,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { config } from '@/config';
import { Public, User } from '@/decorators';
import { AppException } from '@/utils';

import { SignInProviderEnum, SignUpDto, SignInDto, UserDTO } from '../dtos';
import {
  SignUpService,
  SignInService,
  SignOutService,
  RefreshTokenService,
  SignInWithOAuthService,
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
  async signUp(@Body() signUpDto: SignUpDto) {
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
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.signInService.handler(signInDto);

    return result.match(
      (value) => {
        response.cookie('refreshToken', value.session.refreshToken, {
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
      SignInProviderEnum.GITHUB,
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
  async signOut(
    @Headers('authorization') authorization: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = authorization.replace('Bearer ', '');

    const result = await this.signOutService.handler(token);

    return result.match(
      () => {
        response.clearCookie('refreshToken');
        return { message: 'Successfully signed out' };
      },
      (error) => {
        throw new AppException(error);
      },
    );
  }

  @Post('refresh')
  async refreshToken(
    @Req() request: RequestWithCookies,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppException({
        type: HttpStatus.BAD_REQUEST,
        message: 'Refresh token not found',
      });
    }

    const result = await this.refreshTokenService.handler(refreshToken);

    return result.match(
      (value) => {
        response.cookie('refreshToken', value.session.refreshToken, {
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
