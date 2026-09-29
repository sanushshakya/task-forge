// lib/validation.ts

/**
 * Entry schema and validation helper using Zod.
 */

import { z } from 'zod';

// Define entry schema
const EntrySchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  tags: z.array(z.string()).optional(),
});

/**
 * Validates an entry using the defined schema.
 * @param data - Entry data to validate.
 * @returns A success/error object indicating validation result.
 */
export function validateEntry(data: any): { success: boolean; error?: string } {
  try {
    const validatedData = EntrySchema.parse(data);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(issue => issue.message).join(', ') };
    }
    return { success: false, error: 'Validation failed' };
  }
}

// Define password schema using Zod
const PasswordSchema = z.string().min(8, "Password must be at least 8 characters")
  .regex(/(?=.*[0-9])/, "Password must contain at least one number")
  .regex(/(?=.*[a-zA-Z])/, "Password must contain at least one letter");

/**
 * Validates a password using the defined schema.
 * @param password - Password to validate.
 * @returns A success/error object indicating validation result.
 */
export function validatePassword(password: string): { success: boolean; error?: string } {
  try {
    const validatedData = PasswordSchema.parse(password);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(issue => issue.message).join(', ') };
    }
    return { success: false, error: 'Validation failed' };
  }
}