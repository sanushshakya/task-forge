// app/api/insights/weekly/route.ts

import { FastAPI } from 'fastapi';
import { Depends, Request } from 'fastapi.types';
import decodeToken from '@/auth/dependencies.py';
import Entry from '@/models/Entry'; // Import the Entry model
import libOllama from '@/lib/ollama.ts'; // Import the Ollama API client

const app = new FastAPI();

/**
 * Route handler for retrieving insights about the authenticated user's last 7 entries.
 * @param request - The incoming HTTP request.
 * @returns A JSON response containing the last 7 entries of the authenticated user, including mood scores and task completion rates.
 */
export async function GET(request: Request) {
  try {
    // Extract the token from the authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HTTPException(401, 'Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await decodeToken(token);
    const userId = decodedToken.userId;

    // Fetch the last 7 entries for the authenticated user
    const entries = await Entry.find({ userId })
      .sort({ createdAt: -1 })
      .limit(7);

    // Calculate mood scores and task completion rates for each entry
    const insights = entries.map(entry => ({
      id: entry.id,
      moodScore: calculateMoodScore(entry.mood),
      taskCompletionRate: calculateTaskCompletionRate(entry.tasks)
    }));

    // Call the Ollama API to get additional insights
    const ollamaResponse = await libOllama.generateSummary(insights);

    return {
      data: {
        insights,
        summary: ollamaResponse.summary
      }
    };
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    throw new HTTPException(500, 'Internal Server Error');
  }
}

/**
 * Calculates the mood score based on the mood entry.
 * @param mood - The mood entry.
 * @returns The calculated mood score.
 */
function calculateMoodScore(mood: string): number {
  // Implement your mood score calculation logic here
  return 0; // Placeholder return value
}

/**
 * Calculates the task completion rate for a list of tasks.
 * @param tasks - The list of tasks.
 * @returns The calculated task completion rate as a percentage.
 */
function calculateTaskCompletionRate(tasks: string[]): number {
  // Implement your task completion rate calculation logic here
  return 0; // Placeholder return value
}