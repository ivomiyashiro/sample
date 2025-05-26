import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/core/database/database.module';
import { SampleDTO } from '../dtos';

@Injectable()
export class GetSamplesService {
  constructor(private readonly prisma: DatabaseService) {}

  async handle(): Promise<SampleDTO[]> {
    return this.prisma.sample.findMany();
  }
}
