import {
  PaginationQuery,
  PaginatedResult,
  PaginationMetadata,
} from '../common/dtos/pagination.dto';

export interface PaginationOptions {
  defaultLimit?: number;
  maxLimit?: number;
  allowedSortFields?: string[];
  defaultSortField?: string;
  defaultSortOrder?: 'asc' | 'desc';
}

export abstract class PaginationService<T> {
  protected readonly defaultOptions: Required<PaginationOptions> = {
    defaultLimit: 10,
    maxLimit: 100,
    allowedSortFields: [],
    defaultSortField: '',
    defaultSortOrder: 'desc',
  };

  constructor(options?: PaginationOptions) {
    if (options) {
      this.defaultOptions = { ...this.defaultOptions, ...options };
    }
  }

  protected normalizeQuery(query: PaginationQuery): {
    page: number;
    limit: number;
    skip: number;
    orderBy: Record<string, 'asc' | 'desc'>;
  } {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(
      Math.max(1, query.limit || this.defaultOptions.defaultLimit),
      this.defaultOptions.maxLimit,
    );
    const skip = (page - 1) * limit;

    // Build sort options with proper validation
    const orderBy: Record<string, 'asc' | 'desc'> = {};
    if (
      query.sortBy &&
      this.defaultOptions.allowedSortFields.includes(query.sortBy)
    ) {
      orderBy[query.sortBy] =
        query.sortOrder || this.defaultOptions.defaultSortOrder;
    } else {
      orderBy[this.defaultOptions.defaultSortField] =
        this.defaultOptions.defaultSortOrder;
    }

    return { page, limit, skip, orderBy };
  }

  protected buildMetadata(
    page: number,
    limit: number,
    totalItems: number,
  ): PaginationMetadata {
    const totalPages = Math.ceil(totalItems / limit);

    return {
      currentPage: page,
      totalPages,
      totalItems,
      pageSize: limit,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  protected buildResult(
    items: T[],
    pagination: PaginationMetadata,
  ): PaginatedResult<T> {
    return {
      items,
      pagination,
    };
  }

  // Abstract method that implementing classes must provide
  abstract handler(query: PaginationQuery): Promise<PaginatedResult<T>>;
}
