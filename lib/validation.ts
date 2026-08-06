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
 * @returns The validated entry or throws an error if validation fails.
 */
export function validateEntry(data: any) {
  return EntrySchema.parse(data);
}