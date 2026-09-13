// app/admin/users/utils.ts

/**
 * Utility functions for handling admin users operations.
 */

import { User } from '../models/User';

/**
 * Filters an array of users based on an email search term using a regex pattern.
 *
 * @param users - The array of users to filter.
 * @param searchTerm - The email search term to use for filtering.
 * @returns An array of users that match the search term.
 */
export function filterUsersByEmail(users: User[], searchTerm: string): User[] {
  if (!searchTerm) return users;

  // Create a regex pattern from the search term
  const emailRegex = new RegExp(searchTerm, 'i');

  // Filter users based on the email regex pattern
  return users.filter(user => emailRegex.test(user.email));
}