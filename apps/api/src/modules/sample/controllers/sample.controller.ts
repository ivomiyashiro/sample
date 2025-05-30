import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { CreateSampleDTO, SampleDTO, UpdateSampleDTO } from '@sample/shared';

import { AppErrorType, AppException, ResultVoid } from '@/utils';

import { Public } from '@/common/decorators';

import { PaginatedSampleDTO } from '../dtos';
import {
  CreateSampleService,
  DeleteSampleService,
  GetSampleByIdService,
  GetSamplesService,
  UpdateSampleService,
} from '../services';

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
    const result = await this.createSampleService.handler(body);

    return result.match(
      (value) => value,
      (error) => {
        throw new AppException(error);
      },
    );
  }

  @Public()
  @Get()
  async getSamples(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ): Promise<PaginatedSampleDTO> {
    return this.getSamplesService.handler({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      sortBy: sortBy ?? '',
      sortOrder: sortOrder ?? 'desc',
    });
  }

  @Public()
  @Get(':id')
  async getSample(@Param('id') id: string): Promise<SampleDTO> {
    const result = await this.getSampleByIdService.handler(id);

    return result.match(
      (value) => value,
      (error) => {
        throw new AppException(error);
      },
    );
  }

  @Put(':id')
  async updateSample(
    @Param('id') id: string,
    @Body() body: UpdateSampleDTO,
  ): Promise<SampleDTO> {
    const result = await this.updateSampleService.handler(id, body);

    return result.match(
      (value) => value,
      (error) => {
        throw new AppException(error);
      },
    );
  }

  @Delete(':id')
  async deleteSample(
    @Param('id') id: string,
  ): Promise<ResultVoid<AppErrorType>> {
    const result = await this.deleteSampleService.handler(id);

    return result.match(
      () => ResultVoid.success(),
      (error) => {
        throw new AppException(error);
      },
    );
  }
}
