import jwt from 'jsonwebtoken';
import { User } from '@/models/User';

/**
 * Dependency for decoding a JWT token and returning the current user.
 * @param token - The JWT token to decode.
 * @returns The decoded user object or null if the token is invalid.
 */
export function get_current_user(token: string): User | null {
  try {
    // Decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    // Find the user by their ID
    return await User.findById(decoded.userId);
  } catch (error) {
    // Return null if the token is invalid
    return null;
  }
}