import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { config } from './core/config';
import { DatabaseModule } from './core/database/database.module';
import { SampleModule } from './modules/sample/sample.module';

@Module({
  imports: [
    SampleModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: ['.env.local', '.env'],
      validationSchema: null,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
