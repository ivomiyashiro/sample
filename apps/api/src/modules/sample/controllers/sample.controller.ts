import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateSampleDTO, UpdateSampleDTO } from '@sample/shared';

import { Public } from '@/decorators';
import { AppErrorType, AppException, ResultVoid } from '@/utils';

import {
  CreateSampleService,
  GetSamplesService,
  GetSampleByIdService,
  DeleteSampleService,
  UpdateSampleService,
} from '../services';

import { SampleDTO, PaginatedSampleDTO } from '../dtos';

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
    return this.getSamplesService.handle({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      sortBy: sortBy ?? '',
      sortOrder: sortOrder ?? 'desc',
    });
  }

  @Public()
  @Get(':id')
  async getSample(@Param('id') id: string): Promise<SampleDTO> {
    const result = await this.getSampleByIdService.handle(id);

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
    const result = await this.updateSampleService.handle(id, body);

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
    const result = await this.deleteSampleService.handle(id);

    return result.match(
      () => ResultVoid.success(),
      (error) => {
        throw new AppException(error);
      },
    );
  }
}
