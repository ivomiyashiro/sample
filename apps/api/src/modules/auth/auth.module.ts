import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { AuthSupabaseService } from '@/common/services/supabase/services';
import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy';

import { AuthController } from './controllers/auth.controller';
import {
  RefreshTokenService,
  SignInService,
  SignInWithOAuthService,
  SignOutService,
  SignUpService,
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
