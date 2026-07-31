import bcrypt from 'bcryptjs';

/**
 * Utility functions for password handling using bcrypt.
 */
export class PasswordUtil {
  /**
   * Hashes a plain text password.
   * @param plainTextPassword - The plain text password to hash.
   * @returns A promise that resolves to the hashed password.
   */
  public static async hash(plainTextPassword: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(plainTextPassword, saltRounds);
  }

  /**
   * Verifies a plain text password against a hashed password.
   * @param plainTextPassword - The plain text password to verify.
   * @param hashedPassword - The hashed password to compare against.
   * @returns A promise that resolves to true if the passwords match, false otherwise.
   */
  public static async verify(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }
}