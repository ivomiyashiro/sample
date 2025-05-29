import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy';

import { AuthController } from './controllers/auth.controller';

import { AuthSupabaseService } from '@/common/services/supabase/services';
import {
  SignUpService,
  SignInService,
  SignOutService,
  RefreshTokenService,
  SignInWithOAuthService,
} from './services';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('config.SUPABASE_JWT_SECRET') ||
          'fallback-secret',
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthSupabaseService,
    SignUpService,
    SignInService,
    SignOutService,
    SignInWithOAuthService,
    RefreshTokenService,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
