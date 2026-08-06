// lib/auth.ts

/**
 * Helper functions for handling authentication-related tasks.
 */
export namespace AuthHelper {
  /**
   * Decodes a JWT token and returns the current user's ID.
   * @param request - The incoming HTTP request.
   * @returns The user ID if the token is valid, otherwise null.
   */
  export async function getCurrentUserId(request: Request): Promise<string | null> {
    try {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader) return null;

      const token = authHeader.split(' ')[1];
      if (!token) return null;

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
      return decodedToken.userId as string;
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  /**
   * Checks if a user is authenticated based on the presence of a valid JWT token.
   * @param request - The incoming HTTP request.
   * @returns true if the user is authenticated, false otherwise.
   */
  export async function isAuthenticated(request: Request): Promise<boolean> {
    const userId = await getCurrentUserId(request);
    return !!userId;
  }
}