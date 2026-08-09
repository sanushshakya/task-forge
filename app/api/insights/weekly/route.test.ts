import { FastAPI } from 'fastapi';
import { Depends, Request } from 'fastapi.types';
import decodeToken from '@/auth/dependencies.py';

const app = new FastAPI();

/**
 * Route handler for retrieving the authenticated user's ID.
 * @param request - The incoming HTTP request.
 * @returns A JSON response containing the authenticated user's ID or a 401 error if not authenticated.
 */
export async function GET(request: Request) {
  try {
    // Extract the token from the authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HTTPException(401, 'Unauthorized');
    }

    // Decode the JWT token to get the user ID
    const token = authHeader.split(' ')[1];
    const decodedToken = decodeToken(token);

    return JSONResponse({
      userId: decodedToken.userId,
    });
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    throw new HTTPException(500, 'Internal Server Error');
  }
}