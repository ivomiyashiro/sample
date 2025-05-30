import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SampleDTO } from '@sample/shared';

import { DatabaseService } from '@/common/services/database/database.module';
import { PaginationQuery } from '@/common/dtos/pagination.dto';
import { PaginationService } from '@/utils';

import { PaginatedSampleDTO } from '../../dtos';

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
