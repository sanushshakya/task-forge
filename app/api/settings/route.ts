// models/Settings.ts

/**
 * Represents a user's settings including preferences for AI summaries and weekly insights.
 */
export interface Settings {
  /**
   * Indicates whether AI summary generation is enabled.
   */
  aiSummaryEnabled: boolean;

  /**
   * Indicates whether weekly insight generation is enabled.
   */
  weeklyInsightEnabled: boolean;
}

// app/api/settings/route.ts

import { FastAPI, HTTPException, Request, Response } from 'fastapi';
import { Depends, Patch, Post, Query } from 'fastapi.types';
import { decodeToken } from '@/auth/dependencies.py';

const app = new FastAPI();

/**
 * Middleware to ensure the routes only process requests for authenticated users.
 * @param request - The incoming HTTP request.
 * @param call_next - The next middleware or route handler in the chain.
 * @returns The response from the next middleware or route handler.
 */
async function authMiddleware(request: Request, call_next) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    throw new HTTPException(401, 'Unauthorized');
  }

  try {
    decodeToken(authHeader);
    return await call_next(request);
  } catch (error) {
    throw new HTTPException(401, 'Unauthorized');
  }
}

/**
 * Route handler for retrieving the authenticated user's settings.
 * @param request - The incoming HTTP request.
 * @returns A JSON response containing the user's settings or a 401 error if not authenticated.
 */
export async function GET(request: Request): Promise<Response> {
  const userId = decodeToken(request.headers.get('Authorization')).userId;

  // Fetch the user's settings from the database (simulated here)
  const settings: Settings = {
    aiSummaryEnabled: true,
    weeklyInsightEnabled: false,
  };

  return new Response(JSON.stringify(settings), { status_code: 200 });
}

/**
 * Route handler for updating the authenticated user's settings.
 * @param request - The incoming HTTP request.
 * @param body - The request body containing the updated settings.
 * @returns A JSON response indicating success or a 401 error if not authenticated.
 */
export async function PATCH(request: Request, body: Settings): Promise<Response> {
  const userId = decodeToken(request.headers.get('Authorization')).userId;

  // Update the user's settings in the database (simulated here)
  // For demonstration, we'll just return the updated body
  return new Response(JSON.stringify(body), { status_code: 200 });
}

// Apply authMiddleware to the /settings endpoint
app.add_middleware(authMiddleware);
app.get('/settings', GET);
app.patch('/settings', PATCH);