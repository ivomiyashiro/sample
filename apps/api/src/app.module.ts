import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { DatabaseModule } from './common/services/database/database.module';
import { SupabaseModule } from './common/services/supabase/supabase.module';
import { config } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { SampleModule } from './modules/sample/sample.module';

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
