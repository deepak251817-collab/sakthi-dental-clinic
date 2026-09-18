import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'

/** Middleware factory: validates req.body against a Zod schema, then continues. */
export function validateBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      // Delegated to the centralized error handler for a uniform response shape.
      next(result.error)
      return
    }
    req.body = result.data
    next()
  }
}

/** Middleware factory: validates req.query against a Zod schema, then continues. */
export function validateQuery(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      next(result.error)
      return
    }
    // Replace with parsed/coerced values so handlers receive typed query params.
    req.query = result.data as typeof req.query
    next()
  }
}
