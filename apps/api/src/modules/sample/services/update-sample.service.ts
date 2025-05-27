import { HttpStatus, Injectable } from '@nestjs/common';
import { UpdateSampleDTO } from '@sample/shared';

import { DatabaseService } from '@/database/database.module';
import { AppErrorType, Result } from '@/utils';

import { SampleDTO } from '../dtos';
import { GetSampleByIdService } from './get-sample-by-id.service';

@Injectable()
export class UpdateSampleService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly getSampleByIdService: GetSampleByIdService,
  ) {}

  async handle(
    id: string,
    dto: UpdateSampleDTO,
  ): Promise<Result<SampleDTO, AppErrorType>> {
    const result = await this.getSampleByIdService.handle(id);

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
