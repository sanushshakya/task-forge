// src/feature.ts

import { FastAPI, Request, Response, HTTPException } from 'fastapi';
import { validateEntry } from '@/lib/validation.ts';

const app = new FastAPI();

/**
 * Route handler for creating a new entry.
 * @param request - The incoming HTTP request containing the entry data.
 * @returns A JSON response containing the created entry or an error if validation fails.
 */
export async function POST(request: Request, response: Response) {
  try {
    // Extract the entry data from the request body
    const entryData = await request.json();

    // Validate the entry data using Zod schema
    const validationResult = validateEntry(entryData);
    if (!validationResult.success) {
      throw new HTTPException(400, JSON.stringify(validationResult.error.format()));
    }

    // If validation passes, proceed with saving the entry

    // Placeholder for saving the entry logic
    const savedEntry = { ...entryData, id: '123' }; // Simulated saved entry

    return response.status(201).json(savedEntry);
  } catch (error) {
    if (error instanceof HTTPException) {
      return response.status(error.status_code).json({ detail: error.detail });
    }
    return response.status(500).json({ detail: 'Internal Server Error' });
  }
}