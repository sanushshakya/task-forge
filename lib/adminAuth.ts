// lib/adminAuth.ts

import { getUserFromRequest } from '@/auth/dependencies';

/**
 * Middleware to ensure that only admin users can access certain routes.
 *
 * @param req - The request object containing the JWT token.
 * @returns The user ID if the user is an admin, null otherwise.
 */
export function requireAdmin(req): string | null {
  const userId = getUserFromRequest(req);

  if (userId) {
    // TODO: Fetch the user document from the database
    const userDocument = await fetchUserById(userId);

    if (userDocument && userDocument.isAdmin) {
      return userId;
    }
  }

  return null;
}

/**
 * Fetches a user by their ID.
 *
 * @param userId - The unique identifier for the user.
 * @returns A Promise that resolves to the User document or undefined if not found.
 */
async function fetchUserById(userId: string): Promise<User | undefined> {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error('Error fetching user:', error);
  }

  return undefined;
}