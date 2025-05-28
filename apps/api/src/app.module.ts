import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

import { config } from './config';
import { DatabaseModule } from './modules/database/database.module';
import { SampleModule } from './modules/sample/sample.module';
import { AuthModule } from './modules/auth/auth.module';
import { SupabaseModule } from './modules/supabase/supabase.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    AuthModule,
    SampleModule,
    DatabaseModule,
    SupabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: ['.env.local', '.env'],
      validationSchema: null,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
