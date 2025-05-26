import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateSampleDTO, UpdateSampleDTO } from '@sample/shared';

import { AppHttpError, AppHttpException } from '@/shared/utils';
import { ResultVoid } from '@/shared/abstractions';

import {
  CreateSampleService,
  GetSamplesService,
  GetSampleByIdService,
  DeleteSampleService,
  UpdateSampleService,
} from '../services';
import { SampleDTO } from '../dtos';

@Controller('samples')
export class SampleController {
  constructor(
    private readonly createSampleService: CreateSampleService,
    private readonly getSamplesService: GetSamplesService,
    private readonly getSampleByIdService: GetSampleByIdService,
    private readonly updateSampleService: UpdateSampleService,
    private readonly deleteSampleService: DeleteSampleService,
  ) {}

  @Post()
  async createSample(@Body() body: CreateSampleDTO): Promise<SampleDTO> {
    const result = await this.createSampleService.handle(body);

    return result.match(
      (value) => value,
      (error) => {
        throw new AppHttpException(error);
      },
    );
  }

  @Get()
  async getSamples(): Promise<SampleDTO[]> {
    return this.getSamplesService.handle();
  }

  @Get(':id')
  async getSample(@Param('id') id: string): Promise<SampleDTO> {
    const result = await this.getSampleByIdService.handle(id);

    return result.match(
      (value) => value,
      (error) => {
        throw new AppHttpException(error);
      },
    );
  }

  @Put(':id')
  async updateSample(
    @Param('id') id: string,
    @Body() body: UpdateSampleDTO,
  ): Promise<SampleDTO> {
    const result = await this.updateSampleService.handle(id, body);

    return result.match(
      (value) => value,
      (error) => {
        throw new AppHttpException(error);
      },
    );
  }

  @Delete(':id')
  async deleteSample(
    @Param('id') id: string,
  ): Promise<ResultVoid<AppHttpError>> {
    const result = await this.deleteSampleService.handle(id);

    return result.match(
      () => ResultVoid.success(),
      (error) => {
        throw new AppHttpException(error);
      },
    );
  }
}
