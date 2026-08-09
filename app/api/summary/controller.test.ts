import { FastAPI, HTTPException, Depends, Request } from 'fastapi';
import { generateText as ollamaGenerateText } from '@/lib/ollama.ts';

const app = new FastAPI();

/**
 * Route handler for generating entry summaries using the Ollama API.
 * @param request - The incoming HTTP request containing the entry details.
 * @returns A JSON response with the generated summary or an error message.
 */
export async function POST(request: Request) {
  try {
    // Extract the token from the authorization header
    const token = request.headers.get('Authorization');
    if (!token) {
      throw new HTTPException(401, 'Unauthorized');
    }

    // Decode the JWT token to get user details
    const decodedToken = decodeToken(token);
    if (!decodedToken) {
      throw new HTTPException(401, 'Invalid token');
    }

    // Parse the request body for entry details
    const requestBody = await request.json();
    if (!requestBody.entryContent) {
      throw new HTTPException(422, 'Missing entry content');
    }

    // Generate text using Ollama API
    const summary = await ollamaGenerateText(requestBody.entryContent);

    return {
      summary,
    };
  } catch (error: any) {
    if (error instanceof HTTPException) {
      throw error;
    }
    console.error('Error generating entry summary:', error);
    throw new HTTPException(500, 'Internal server error');
  }
}