import type { NextFunction, Request, Response } from 'express'

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>

/**
 * Wraps async route handlers so rejections flow into the centralized
 * error handler (Express 4 does not catch async throws by itself).
 */
export function asyncHandler(handler: AsyncHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}
