import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

// Define environment variables using Zod schema for validation
const envSchema = z.object({
  MONGODB_URI: z.string().url(),
  JWT_SECRET: z.string().min(32),
  OLLAMA_URL: z.string().url().default('http://localhost:11434'),
});

if (!envSchema.safeParse(process.env).success) {
  throw new Error('Missing or invalid environment variables');
}

const { JWT_SECRET } = envSchema.parse(process.env);

// Define types for JWT token and user ID
export interface JwtToken {
  userId: string;
  exp: number; // Expiration time in seconds
}

/**
 * Class to handle JWT encoding and decoding with expiration.
 */
class JwtHandler {
  /**
   * Encodes a user's ID into a JWT token with an expiration time.
   * @param {string} userId - The user ID to encode.
   * @returns {string} - The encoded JWT token.
   */
  public static encodeToken(userId: string): string {
    const payload: JwtToken = {
      userId,
      exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
    };
    return jwt.sign(payload, JWT_SECRET);
  }

  /**
   * Decodes a JWT token and returns the user ID.
   * @param {string} token - The JWT token to decode.
   * @returns {JwtToken} - The decoded JWT token payload containing the user ID and expiration time.
   */
  public static decodeToken(token: string): JwtToken {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtToken;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}

export default JwtHandler;