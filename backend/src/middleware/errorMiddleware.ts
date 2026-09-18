import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

/** Error shape produced by our own throwApiError helper. */
export class ApiError extends Error {
  readonly statusCode: number
  readonly isOperational = true

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

/** Throw anywhere in a route/service to produce a clean JSON error. */
export function throwApiError(statusCode: number, message: string): never {
  throw new ApiError(statusCode, message)
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ success: false, message: 'Endpoint not found' })
}

// Express 4 needs the full 4-arg signature even when next is unused.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Malformed JSON bodies from express.json() carry a 400 status — report them
  // as client errors instead of leaking a 500 for bad client input.
  if (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    (error as { type?: string }).type === 'entity.parse.failed'
  ) {
    res.status(400).json({ success: false, message: 'Malformed JSON body' })
    return
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Invalid request data',
      errors: error.issues.map((issue) => ({
        field: issue.path.join('.') || 'body',
        message: issue.message,
      })),
    })
    return
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({ success: false, message: error.message })
    return
  }

  // Unexpected errors: log server-side, never expose internals to the client.
  // eslint-disable-next-line no-console -- unexpected errors must be visible server-side
  console.error('Unhandled error:', error)
  res.status(500).json({ success: false, message: 'Internal server error' })
}
