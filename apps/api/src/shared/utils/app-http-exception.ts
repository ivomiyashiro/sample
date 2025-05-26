import { HttpException, HttpStatus } from '@nestjs/common';

export type AppHttpError = {
  type: HttpStatus;
  message?: string;
  details?: Record<string, string[]>;
};

export class AppHttpException extends HttpException {
  constructor(appError: AppHttpError) {
    const response = {
      type: appError.type,
      message:
        appError.message ||
        AppHttpException.getMessageFromStatus(appError.type),
      details: appError.details,
    };

    super(response, appError.type);
  }

  private static getMessageFromStatus(status: HttpStatus): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad Request';
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized';
      case HttpStatus.FORBIDDEN:
        return 'Forbidden';
      case HttpStatus.NOT_FOUND:
        return 'Not Found';
      case HttpStatus.CONFLICT:
        return 'Conflict';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'Unprocessable Entity';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'Internal Server Error';
      default:
        return 'An error occurred';
    }
  }
}
