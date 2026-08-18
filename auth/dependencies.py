// auth/dependencies.ts

import { JWT_SECRET } from '../lib/env';
import jwt from 'jsonwebtoken';

/**
 * Decodes a JWT token and returns the current user's ID.
 * 
 * @param token - The JWT token to decode.
 * @returns The user's ID if decoding is successful, throws an error otherwise.
 */
export const decodeToken = (token: string): string => {
  try {
    // Verify the JWT token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    // Throw a clear error if token is invalid or has expired
    throw new Error('Invalid or expired token');
  }
};