import bcrypt from 'bcryptjs';

/**
 * Utility functions for password hashing and verification.
 */

export class PasswordUtils {
  /**
   * Generates a hashed version of a plain text password using bcrypt.
   *
   * @param {string} password - The plain text password to hash.
   * @returns {Promise<string>} A promise that resolves with the hashed password.
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Verifies if a plain text password matches its hashed version.
   *
   * @param {string} plainText - The plain text password to verify.
   * @param {string} hash - The hashed password to compare against.
   * @returns {Promise<boolean>} A promise that resolves with true if the passwords match, false otherwise.
   */
  static async verifyPassword(plainText: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
  }
}