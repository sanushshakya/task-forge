// app/api/teams/validation.ts

/**
 * This module contains validation rules for team-related operations using TypeScript and Zod schema.
 */

import { z } from 'zod';

/**
 * Schema for validating the creation of a new Team.
 */
export const CreateTeamSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  ownerId: z.string().uuid({ message: 'Owner ID must be a valid UUID' }),
  members: z.array(z.string().uuid({ message: 'Member IDs must be valid UUIDs' })).default([]),
});

/**
 * Schema for validating the update of an existing Team.
 */
export const UpdateTeamSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).optional(),
  ownerId: z.string().uuid({ message: 'Owner ID must be a valid UUID' }).optional(),
  members: z.array(z.string().uuid({ message: 'Member IDs must be valid UUIDs' })).default([]).optional(),
});

/**
 * Function to validate the creation of a new Team.
 * @param data - The data to validate.
 */
export function validateCreateTeam(data: any): void {
  const result = CreateTeamSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.message);
  }
}

/**
 * Function to validate the update of an existing Team.
 * @param data - The data to validate.
 */
export function validateUpdateTeam(data: any): void {
  const result = UpdateTeamSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.message);
  }
}