interface BaseResponse {
  statusCode: number;
  success: boolean;
  timestamp: string;
}

/**
 * Error details for development environment
 */
export interface ErrorDetails {
  cause?: unknown;
  stack?: string;
  type?: string;
}

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
