import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { config } from './config';
import { DatabaseModule } from './database/database.module';
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
