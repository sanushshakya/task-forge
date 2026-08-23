// auth/dependencies.py

import jwt from 'jsonwebtoken';

/**
 * Decodes a JWT token and returns the current user's ID.
 * @param {string} token - The JWT token to decode.
 * @returns {string | undefined} - The decoded user ID or undefined if decoding fails.
 */
export const get_current_user = (token: string): string | undefined => {
  try {
    // Decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded.userId as string;
  } catch (error) {
    // Return undefined if decoding fails
    return undefined;
  }
};