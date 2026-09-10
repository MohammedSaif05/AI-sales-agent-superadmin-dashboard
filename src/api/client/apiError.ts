import { ApiErrorResponse } from '../types/common.types';

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly details: unknown;
  public readonly timestamp: string;
  public readonly path: string;

  constructor(errorResponse: ApiErrorResponse) {
    super(errorResponse.message || 'An unexpected error occurred');
    this.name = 'ApiError';
    this.statusCode = errorResponse.statusCode;
    this.errorCode = errorResponse.errorCode;
    this.details = errorResponse.details;
    this.timestamp = errorResponse.timestamp;
    this.path = errorResponse.path;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static fromUnknown(err: unknown, fallbackPath = ''): ApiError {
    if (err instanceof ApiError) return err;

    return new ApiError({
      success: false,
      statusCode: 500,
      errorCode: 'UNKNOWN_ERROR',
      message: err instanceof Error ? err.message : 'A network or unexpected error occurred',
      timestamp: new Date().toISOString(),
      path: fallbackPath,
    });
  }
}
