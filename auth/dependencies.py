// auth/dependencies.py

import jwt from 'jsonwebtoken';
import { User } from '../models/User';

/**
 * Decodes a JWT token and returns the current user's ID.
 * @param token - The JWT token to decode.
 * @returns The ID of the authenticated user or null if decoding fails.
 */
export async function get_current_user(token: string): Promise<string | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded.userId as string;
  } catch (error) {
    return null;
  }
}