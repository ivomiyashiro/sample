import { Injectable } from '@nestjs/common';

import { DatabaseService } from '@/database/database.module';
import { AppHttpError, ResultVoid } from '@/utils';

import { GetSampleByIdService } from './get-sample-by-id.service';

@Injectable()
export class DeleteSampleService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly getSampleByIdService: GetSampleByIdService,
  ) {}

  async handle(id: string): Promise<ResultVoid<AppHttpError>> {
    const result = await this.getSampleByIdService.handle(id);

    if (result.isFailure) {
      return ResultVoid.failure(result.error);
    }

    await this.prisma.sample.delete({
      where: { sampleId: id },
    });

    return ResultVoid.success();
  }
}
