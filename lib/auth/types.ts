// auth/types.ts

/**
 * Define TypeScript types for JWT token and user ID.
 */
export interface JWTToken {
  /**
   * The user ID associated with the JWT.
   */
  userId: string;

  /**
   * Expiration time of the JWT.
   */
  exp: number;
}

/**
 * Type representing a user ID.
 */
export type UserID = string;