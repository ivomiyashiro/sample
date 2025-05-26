import { HttpStatus, Injectable } from '@nestjs/common';

import { DatabaseService } from '@/core/database/database.module';
import { Result } from '@/shared/abstractions';
import { AppHttpError } from '@/shared/utils';

import { SampleDTO } from '../dtos';

@Injectable()
export class GetSampleByIdService {
  constructor(private readonly prisma: DatabaseService) {}

  async handle(id: string): Promise<Result<SampleDTO, AppHttpError>> {
    const sample = await this.prisma.sample.findUnique({
      where: { sampleId: id },
    });

    if (sample === null) {
      return Result.failure({
        message: `Sample with id ${id} not found`,
        type: HttpStatus.NOT_FOUND,
        details: {
          id: ['Sample not found'],
        },
      });
    }

    return Result.success(sample);
  }
}
