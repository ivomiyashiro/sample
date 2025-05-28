import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSampleDTO } from '@sample/shared';

import { AppErrorType, Result } from '@/utils';
import { DatabaseService } from '@/modules/database/database.module';

import { SampleDTO } from '@/modules/sample/dtos';
import { createSampleValidator } from './create-sample.validator';

@Injectable()
export class CreateSampleService {
  constructor(private readonly prismaService: DatabaseService) {}

  async handler(
    dto: CreateSampleDTO,
  ): Promise<Result<SampleDTO, AppErrorType>> {
    const validationResult = createSampleValidator.safeParse(dto);

    if (!validationResult.success) {
      return Result.failure({
        type: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const existingSample = await this.prismaService.sample.findFirst({
      where: {
        name: validationResult.data.name,
      },
    });

    if (existingSample) {
      return Result.failure({
        type: HttpStatus.CONFLICT,
        message: `Sample with name "${validationResult.data.name}" already exists`,
        details: {
          name: ['Sample already exists'],
        },
      });
    }

    const sample = await this.prismaService.sample.create({
      data: {
        name: validationResult.data.name,
        description: validationResult.data.description,
        imageUrl: validationResult.data.imageUrl,
      },
    });

    return Result.success(sample);
  }
}
