export interface BaseResponse {
  statusCode: number;
  success: boolean;
  timestamp: string;
}

/**
 * Error details for development environment
 */
export type ErrorDetails = {
  cause?: unknown;
  stack?: string;
  type?: string;
};

/**
 * Structured error response format
 */
export interface ErrorResponse extends BaseResponse {
  error: {
    message: string;
    details?: ErrorDetails;
  };
}

/**
 * Success response format
 */
export interface SuccessResponse<T> extends BaseResponse {
  data?: T;
}

/**
 * Paginated response format
 */
export interface PaginatedResponse<T> extends BaseResponse {
  data: {
    items: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      pageSize: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  };
}

export type PaginatedQueryParams = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
};
