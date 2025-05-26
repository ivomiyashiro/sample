import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ErrorDetails, ErrorResponse } from '@sample/shared';
import { Request, Response } from 'express';

/**
 * Configuration for sensitive data redaction
 */
const SENSITIVE_CONFIG = {
  headers: ['authorization', 'cookie', 'x-api-key', 'x-auth-token'],
  bodyFields: ['password', 'token', 'secret', 'key', 'auth'],
  redactedValue: '[REDACTED]',
} as const;

/**
 * Processed exception information
 */
interface ProcessedExceptionInfo {
  status: number;
  message: string;
  details?: ErrorDetails | undefined;
}

/**
 * Global exception filter that handles all unhandled exceptions
 * and formats them into a consistent error response structure.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  private readonly isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Main exception handling method
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const exceptionInfo = this.processException(exception, request);
    const errorResponse = this.buildErrorResponse(exceptionInfo, exception);

    response.status(exceptionInfo.status).json(errorResponse);
  }

  /**
   * Process different types of exceptions and extract relevant information
   */
  private processException(
    exception: unknown,
    request: Request,
  ): ProcessedExceptionInfo {
    if (exception instanceof HttpException) {
      return this.handleHttpException(exception);
    }

    if (exception instanceof Error) {
      return this.handleErrorException(exception, request);
    }

    return this.handleUnknownException(exception, request);
  }

  /**
   * Handle known HTTP exceptions from NestJS
   */
  private handleHttpException(
    exception: HttpException,
  ): ProcessedExceptionInfo {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'string') {
      return { status, message: exceptionResponse };
    }

    if (this.isValidResponseObject(exceptionResponse)) {
      const responseObj = exceptionResponse as {
        message?: string;
        details?: unknown;
        error?: string;
        type?: number;
      };

      // Extract details from the exception response
      const details: ErrorDetails | undefined = responseObj.details
        ? {
            cause: responseObj.details,
          }
        : undefined;

      return {
        status,
        message:
          responseObj.message || responseObj.error || 'An error occurred',
        details,
      };
    }

    return { status, message: 'An error occurred' };
  }

  /**
   * Handle standard JavaScript Error instances
   */
  private handleErrorException(
    exception: Error,
    request: Request,
  ): ProcessedExceptionInfo {
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = this.isDevelopment
      ? `Unhandled Error: ${exception.message}`
      : 'Internal server error';

    const details: ErrorDetails | undefined = this.isDevelopment
      ? {
          cause: exception.cause,
        }
      : undefined;

    this.logUnhandledException(exception, request);

    return { status, message, details };
  }

  /**
   * Handle unknown exception types
   */
  private handleUnknownException(
    exception: unknown,
    request: Request,
  ): ProcessedExceptionInfo {
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = this.isDevelopment
      ? 'Unknown exception type encountered'
      : 'Internal server error';

    const details: ErrorDetails | undefined = this.isDevelopment
      ? {
          type: typeof exception,
          cause: this.safeStringify(exception),
        }
      : undefined;

    this.logUnknownException(exception, request);

    return { status, message, details };
  }

  /**
   * Build the complete error response object
   */
  private buildErrorResponse(
    exceptionInfo: ProcessedExceptionInfo,
    exception: unknown,
  ): ErrorResponse {
    const baseError: { message: string; details?: ErrorDetails } = {
      message: exceptionInfo.message,
      ...(exceptionInfo.details && { details: exceptionInfo.details }),
    };

    const developmentExtras = this.isDevelopment
      ? this.buildDevelopmentExtras(exception)
      : {};

    // Merge details if both exist
    const mergedDetails = {
      ...baseError.details,
      ...developmentExtras.details,
    };

    return {
      error: {
        message: baseError.message,
        ...(Object.keys(mergedDetails).length > 0 && {
          details: mergedDetails,
        }),
      },
      statusCode: exceptionInfo.status,
      success: false,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Build additional error information for development environment
   */
  private buildDevelopmentExtras(
    exception: unknown,
  ): Partial<ErrorResponse['error']> {
    const extras: Partial<ErrorResponse['error']> = {};

    if (exception instanceof Error) {
      const errorDetails: ErrorDetails = {};

      if (exception.stack) errorDetails.stack = exception.stack;
      if (exception.constructor.name)
        errorDetails.type = exception.constructor.name;
      if (exception.cause !== undefined) errorDetails.cause = exception.cause;

      if (Object.keys(errorDetails).length > 0) {
        extras.details = errorDetails;
      }
    }

    return extras;
  }

  /**
   * Log unhandled Error exceptions with context
   */
  private logUnhandledException(exception: Error, request: Request): void {
    this.logger.error(`Unhandled exception: ${exception.message}`, {
      stack: exception.stack,
      name: exception.name,
      cause: exception.cause,
      url: `${request.method} ${request.url}`,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
    });
  }

  /**
   * Log unknown exception types with context
   */
  private logUnknownException(exception: unknown, request: Request): void {
    this.logger.error('Unknown exception type', {
      exception: this.safeStringify(exception),
      url: `${request.method} ${request.url}`,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
    });
  }

  /**
   * Check if the exception response is a valid object
   */
  private isValidResponseObject(response: unknown): boolean {
    return typeof response === 'object' && response !== null;
  }

  /**
   * Safely stringify an object, handling circular references
   */
  private safeStringify(obj: unknown): string {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  }

  /**
   * Remove sensitive information from request headers
   */
  private sanitizeHeaders(
    headers: Record<string, unknown>,
  ): Record<string, unknown> {
    const sanitized = { ...headers };

    SENSITIVE_CONFIG.headers.forEach((header) => {
      if (sanitized[header]) {
        sanitized[header] = SENSITIVE_CONFIG.redactedValue;
      }
    });

    return sanitized;
  }

  /**
   * Remove sensitive information from request body
   */
  private sanitizeBody(body: unknown): unknown {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sanitized = { ...(body as Record<string, unknown>) };

    SENSITIVE_CONFIG.bodyFields.forEach((field) => {
      Object.keys(sanitized).forEach((key) => {
        if (key.toLowerCase().includes(field)) {
          sanitized[key] = SENSITIVE_CONFIG.redactedValue;
        }
      });
    });

    return sanitized;
  }
}
