// auth/dependencies.py

import { decode } from 'jsonwebtoken';
import { User } from '../models/User';

/**
 * Decodes a JWT token and returns the current user's ID along with team information.
 * @param {string} token - The JWT token to decode.
 * @returns {Promise<{ userId: string; teamId?: string }>} A promise that resolves to an object containing the user's ID and optionally their team ID.
 * @throws {Error} If the token is invalid or expired.
 */
export const get_current_user = async (token: string): Promise<{ userId: string; teamId?: string }> => {
  try {
    const decodedToken = decode(token, { complete: true });
    if (!decodedToken || !decodedToken.payload || typeof decodedToken.payload.sub !== 'string') {
      throw new Error('Invalid token');
    }
    return { userId: decodedToken.payload.sub };
  } catch (error) {
    throw error;
  }
};