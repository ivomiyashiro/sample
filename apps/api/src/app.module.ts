import { Module } from '@nestjs/common';
import { SampleModule } from './modules/sample';
import { DatabaseModule } from './core/database/database.module';

@Module({
  imports: [SampleModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
