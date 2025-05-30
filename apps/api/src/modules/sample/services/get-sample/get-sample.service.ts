import { Injectable } from '@nestjs/common';

import { SampleDTO } from '@sample/shared';

import { PaginationService } from '@/utils';

import { PaginationQuery } from '@/common/dtos/pagination.dto';
import { DatabaseService } from '@/common/services/database/database.module';

import { PaginatedSampleDTO } from '../../dtos';

import { Prisma } from '@prisma/client';

@Injectable()
export class GetSamplesService extends PaginationService<SampleDTO> {
  constructor(private readonly prisma: DatabaseService) {
    super({
      defaultLimit: 10,
      maxLimit: 100,
      allowedSortFields: Object.values(Prisma.SampleScalarFieldEnum),
      defaultSortField: Prisma.SampleScalarFieldEnum.createdAt,
      defaultSortOrder: Prisma.SortOrder.desc,
    });
  }

  async handler(query: PaginationQuery): Promise<PaginatedSampleDTO> {
    const { page, limit, skip, orderBy } = this.normalizeQuery(query);

    const [totalItems, data] = await Promise.all([
      this.prisma.sample.count(),
      this.prisma.sample.findMany({
        skip,
        take: limit,
        orderBy,
      }),
    ]);

    const pagination = this.buildMetadata(page, limit, totalItems);
    return this.buildResult(data, pagination);
  }
}
