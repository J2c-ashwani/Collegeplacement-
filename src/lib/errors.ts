import { NextResponse } from 'next/server'

// Consistent API response types
export interface ApiSuccess<T = unknown> {
  success: true
  data: T
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError

// Error codes
export const ErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  PAYMENT_ERROR: 'PAYMENT_ERROR',
  UPLOAD_ERROR: 'UPLOAD_ERROR',
  INTEGRATION_ERROR: 'INTEGRATION_ERROR',
} as const

// App error class
export class AppError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly details?: Record<string, unknown>

  constructor(
    code: string,
    message: string,
    statusCode: number = 500,
    details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
  }
}

// Helper functions for API responses
export function successResponse<T>(data: T, meta?: ApiSuccess['meta'], status: number = 200) {
  const response: ApiSuccess<T> = { success: true, data }
  if (meta) response.meta = meta
  return NextResponse.json(response, { status })
}

export function errorResponse(
  code: string,
  message: string,
  status: number = 500,
  details?: Record<string, unknown>
) {
  const response: ApiError = {
    success: false,
    error: { code, message, ...(details && { details }) },
  }
  return NextResponse.json(response, { status })
}

export function validationError(message: string, details?: Record<string, unknown>) {
  return errorResponse(ErrorCode.VALIDATION_ERROR, message, 400, details)
}

export function unauthorizedError(message: string = 'Authentication required') {
  return errorResponse(ErrorCode.UNAUTHORIZED, message, 401)
}

export function forbiddenError(message: string = 'Access denied') {
  return errorResponse(ErrorCode.FORBIDDEN, message, 403)
}

export function notFoundError(message: string = 'Resource not found') {
  return errorResponse(ErrorCode.NOT_FOUND, message, 404)
}

export function conflictError(message: string) {
  return errorResponse(ErrorCode.CONFLICT, message, 409)
}

export function rateLimitError(message: string = 'Too many requests') {
  return errorResponse(ErrorCode.RATE_LIMITED, message, 429)
}

// Handle unknown errors safely (no stack traces in production)
export function handleApiError(error: unknown) {
  console.error('[API Error]', error)

  if (error instanceof AppError) {
    return errorResponse(error.code, error.message, error.statusCode, error.details)
  }

  if (error instanceof Error) {
    // Don't expose internal error messages in production
    const message =
      process.env.NODE_ENV === 'development'
        ? error.message
        : 'An unexpected error occurred'
    return errorResponse(ErrorCode.INTERNAL_ERROR, message, 500)
  }

  return errorResponse(ErrorCode.INTERNAL_ERROR, 'An unexpected error occurred', 500)
}
