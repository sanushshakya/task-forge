// app/api/entries/export/route.ts

import { FastAPI, Request, Response } from 'fastapi';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Entry from '@/models/Entry';
import { decodeToken } from '@/auth/dependencies.py';

const app = new FastAPI();

/**
 * Route handler for exporting all authenticated user's entries as a JSON file.
 * @param request - The incoming HTTP request.
 * @returns A downloadable JSON file with the user's entries or a 401 error if not authenticated.
 */
export async function GET(request: Request, response: Response) {
  try {
    // Extract the token from the authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) throw new Error('No authentication token provided');

    // Decode the JWT token to get the user ID
    const decodedToken = decodeToken(authHeader);
    if (!decodedToken) throw new Error('Invalid or expired token');

    // Retrieve all entries for the authenticated user from MongoDB
    const entries = await Entry.find({ userId: decodedToken.userId });

    // Convert entries to JSON format
    const jsonString = JSON.stringify(entries, null, 2);

    // Set response headers for file download
    response.headers.set('Content-Type', 'application/json');
    response.headers.set('Content-Disposition', 'attachment; filename=entries.json');

    // Send the JSON string as the response body
    return response.send(jsonString);
  } catch (error) {
    // Handle errors and return a 500 error with an error message
    console.error(error);
    return response.status(500).send({ error: 'Internal server error' });
  }
}