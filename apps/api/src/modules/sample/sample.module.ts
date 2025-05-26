import { Module } from '@nestjs/common';
import { SampleController } from './controllers/sample.controller';
import {
  CreateSampleService,
  GetSampleByIdService,
  DeleteSampleService,
  GetSamplesService,
  UpdateSampleService,
} from './services';

@Module({
  imports: [],
  controllers: [SampleController],
  providers: [
    GetSamplesService,
    CreateSampleService,
    GetSampleByIdService,
    UpdateSampleService,
    DeleteSampleService,
  ],
})
export class SampleModule {}
