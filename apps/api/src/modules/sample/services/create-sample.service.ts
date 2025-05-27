import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSampleDTO } from '@sample/shared';

import { AppHttpError, Result } from '@/utils';
import { DatabaseService } from '@/database/database.module';

import { SampleDTO } from '../dtos';
import { createSampleValidator } from '../validators';

@Injectable()
export class CreateSampleService {
  constructor(private readonly prismaService: DatabaseService) {}

  async handle(dto: CreateSampleDTO): Promise<Result<SampleDTO, AppHttpError>> {
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
