// app/api/middleware/auth.ts

/**
 * This module contains authentication middleware for handling JWT tokens and
 * validating user access to routes.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { decodeToken } from '@/auth/dependencies.py';

/**
 * Middleware to validate the JWT token in the Authorization header of incoming requests.
 * @param req - The incoming HTTP request.
 * @param res - The outgoing HTTP response.
 * @param next - The next middleware or route handler in the chain.
 */
export async function authMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => Promise<void>
) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await decodeToken(token);
    req.userId = decodedToken.userId;
  } catch (error) {
    return res.status(403).json({ message: 'Failed to authenticate token' });
  }

  next();
}

/**
 * Middleware to ensure the routes only process requests for authenticated users.
 * @param req - The incoming HTTP request.
 * @param res - The outgoing HTTP response.
 * @param next - The next middleware or route handler in the chain.
 */
export async function userAuthMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => Promise<void>
) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await decodeToken(token);
    req.userId = decodedToken.userId;
  } catch (error) {
    return res.status(403).json({ message: 'Failed to authenticate token' });
  }

  next();
}

/**
 * Middleware to validate the JWT token and check if the user has access to specific routes.
 * @param req - The incoming HTTP request.
 * @param res - The outgoing HTTP response.
 * @param next - The next middleware or route handler in the chain.
 */
export async function adminAuthMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => Promise<void>
) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await decodeToken(token);
    req.userId = decodedToken.userId;

    // Check if the user is an admin
    if (decodedToken.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
  } catch (error) {
    return res.status(403).json({ message: 'Failed to authenticate token' });
  }

  next();
}