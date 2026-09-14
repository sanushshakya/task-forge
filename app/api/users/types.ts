// app/api/users/types.ts

/**
 * Module containing types for the User API.
 */

export interface User {
  /**
   * The unique identifier for the user.
   */
  _id: string;

  /**
   * The username of the user.
   */
  username: string;

  /**
   * The email address of the user.
   */
  email: string;

  /**
   * Indicates whether the user's account is active.
   */
  isActive: boolean;

  /**
   * Optional reference to a team associated with the user.
   */
  teamId?: string;
}

export interface UserSignupRequest {
  /**
   * The username of the user.
   */
  username: string;

  /**
   * The email address of the user.
   */
  email: string;

  /**
   * The password for the user's account.
   */
  password: string;
}