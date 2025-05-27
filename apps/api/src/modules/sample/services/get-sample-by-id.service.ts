import { HttpStatus, Injectable } from '@nestjs/common';

import { DatabaseService } from '@/database/database.module';
import { AppErrorType, Result } from '@/utils';

import { SampleDTO } from '../dtos';

@Injectable()
export class GetSampleByIdService {
  constructor(private readonly prisma: DatabaseService) {}

  async handle(id: string): Promise<Result<SampleDTO, AppErrorType>> {
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
