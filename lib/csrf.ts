// lib/csrf.ts

/**
 * This module contains logic for verifying the Origin header of incoming requests against an allowed list from env ALLOWED_ORIGIN.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Verifies the Origin header of incoming requests against an allowed list from env ALLOWED_ORIGIN.
 *
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 * @param next - The next middleware function in the stack.
 */
export function verifyOrigin(req: Request, res: Response, next: NextFunction): void {
  const allowedOrigins = process.env.ALLOWED_ORIGIN?.split(',') || [];

  // Get the Origin header from the request
  const origin = req.headers.origin;

  // Check if the Origin is in the allowed list
  if (allowedOrigins.includes(origin)) {
    next(); // Proceed to the next middleware function
  } else {
    res.status(403).json({ error: 'Forbidden' }); // Return a 403 Forbidden status if not allowed
  }
}