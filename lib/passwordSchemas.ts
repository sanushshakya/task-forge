// lib/passwordSchemas.ts

import { z } from 'zod';

/**
 * Validates a password to ensure it meets certain criteria:
 * - Minimum length of 8 characters
 * - At least one number
 * - At least one letter
 */
export const passwordSchema = z.string().min(8, "Password must be at least 8 characters long")
  .regex(/(?=.*\d)/, "Password must contain at least one digit")
  .regex(/(?=.*[a-zA-Z])/, "Password must contain at least one letter");