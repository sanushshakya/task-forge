// auth/dependencies.py

import jwt from 'jsonwebtoken';
import { User } from '../models/User';

/**
 * Decodes a JWT token and returns the current user's ID along with team information.
 * @param token - The JWT token to decode.
 * @returns A promise that resolves to the decoded user and team object, or rejects if the token is invalid.
 */
export async function getUserFromRequest(token: string): Promise<{ user: User; team?: any }> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId as string;
    const user = await User.findById(userId).populate('teamId');
    if (!user) {
      throw new Error('User not found');
    }
    return { user };
  } catch (error) {
    throw new Error('Invalid token');
  }
}