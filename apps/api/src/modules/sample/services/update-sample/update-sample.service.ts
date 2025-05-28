import { HttpStatus, Injectable } from '@nestjs/common';
import { UpdateSampleDTO } from '@sample/shared';

import { DatabaseService } from '@/modules/database/database.module';
import { AppErrorType, Result } from '@/utils';

import { SampleDTO } from '@/modules/sample/dtos';
import { GetSampleByIdService } from '../get-sample-by-id/get-sample-by-id.service';
import { updateSampleValidator } from './update-sample.validator';

@Injectable()
export class UpdateSampleService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly getSampleByIdService: GetSampleByIdService,
  ) {}

  async handler(
    id: string,
    dto: UpdateSampleDTO,
  ): Promise<Result<SampleDTO, AppErrorType>> {
    const validationResult = updateSampleValidator.safeParse(dto);

    if (!validationResult.success) {
      return Result.failure({
        type: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const result = await this.getSampleByIdService.handler(id);

    if (result.isFailure) {
      return Result.failure(result.error);
    }

    const sampleWithSameName = await this.prisma.sample.findFirst({
      where: { name: dto.name },
    });

    if (sampleWithSameName) {
      return Result.failure({
        type: HttpStatus.BAD_REQUEST,
        message: `Name "${dto.name}" is already taken`,
        details: {
          name: ['Name is already taken'],
        },
      });
    }

    const sample = await this.prisma.sample.update({
      where: { sampleId: id },
      data: {
        name: dto.name,
        description: dto.description,
        imageUrl: dto.imageUrl,
      },
    });

    return Result.success(sample);
  }
}
