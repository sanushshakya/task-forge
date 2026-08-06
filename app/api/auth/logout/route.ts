import { FastAPI } from 'fastapi';
import { HTTPException } from 'fastapi.exceptions';
import { Depends, Request } from 'fastapi.types';
import { CookieParams, Response as FastAPIResponse } from 'httpx';
import jwt from 'jsonwebtoken';

// Import custom dependencies
import decodeToken from '@/auth/dependencies.py';

const app = new FastAPI();

/**
 * Route handler for logging out a user by clearing the JWT cookie.
 * @param request - The incoming HTTP request.
 * @returns A response indicating successful logout.
 */
app.post('/api/auth/logout', async (request: Request) => {
  // Clear the JWT cookie
  const cookieParams: CookieParams = { maxAge: -1, path: '/' };
  return new FastAPIResponse('Logged out successfully.', {
    status_code: 200,
    headers: {
      'Set-Cookie': `access_token=; ${cookieParams.maxAge}; path=${cookieParams.path}`,
    },
  });
});

/**
 * Middleware to verify JWT token and extract user information.
 * @param request - The incoming HTTP request.
 * @returns The current user object if authentication is successful.
 */
const authMiddleware = async (request: Request) => {
  const token = request.cookies.get('access_token');
  if (!token) throw new HTTPException(401, 'Not authenticated');

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { userId: string };
    return await decodeToken(decodedToken.userId);
  } catch (error) {
    throw new HTTPException(401, 'Invalid token');
  }
};

// Example usage of authMiddleware in a protected route
app.get('/api/user-info', async (request: Request) => {
  const user = await authMiddleware(request);
  return { userId: user.userId, email: user.email };
});

export default app;