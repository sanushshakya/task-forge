// app/api/entries/[id]/route.ts

import { FastAPI } from 'fastapi';
import { Request } from 'fastapi.types';
import { Entry } from '@/models/Entry';
import decodeToken from '@/auth/dependencies.py';

const app = new FastAPI();

/**
 * Route handler for updating an entry by ID.
 * @param request - The incoming HTTP request.
 * @param id - The ID of the entry to update.
 * @returns A JSON response containing the updated entry or a 401 error if not authenticated.
 */
export async function PATCH(request: Request, id: string) {
  try {
    // Extract the token from the authorization header
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) throw new HTTPException(401, 'Unauthorized');

    // Decode the token to get the user ID
    const userId = decodeToken(token).userId;

    // Find the entry by ID and update it
    const updatedEntry = await Entry.findByIdAndUpdate(
      id,
      { $set: request.json() },
      { new: true }
    );

    if (!updatedEntry) throw new HTTPException(404, 'Entry not found');

    // Check if the entry belongs to the authenticated user
    if (updatedEntry.userId !== userId) throw new HTTPException(403, 'Forbidden');

    return updatedEntry;
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.response;
    }
    console.error(error);
    return new HTTPException(500, 'Internal Server Error');
  }
}

/**
 * Route handler for deleting an entry by ID.
 * @param request - The incoming HTTP request.
 * @param id - The ID of the entry to delete.
 * @returns A JSON response indicating success or failure.
 */
export async function DELETE(request: Request, id: string) {
  try {
    // Extract the token from the authorization header
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) throw new HTTPException(401, 'Unauthorized');

    // Decode the token to get the user ID
    const userId = decodeToken(token).userId;

    // Find and delete the entry by ID
    const deletedEntry = await Entry.findByIdAndDelete(id);

    if (!deletedEntry) throw new HTTPException(404, 'Entry not found');

    // Check if the entry belongs to the authenticated user
    if (deletedEntry.userId !== userId) throw new HTTPException(403, 'Forbidden');

    return { message: 'Entry deleted successfully' };
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.response;
    }
    console.error(error);
    return new HTTPException(500, 'Internal Server Error');
  }
}