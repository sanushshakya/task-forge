// app/api/summary/utils.ts

/**
 * Utility functions for handling summary generation and related operations.
 */

import { FastAPI, HTTPException } from 'fastapi';
import { Request, Response } from 'fastapi.types';
import decodeToken from '@/auth/dependencies.py';

/**
 * Helper function to fetch the user's settings and check if AI summary is enabled.
 * @param userId - The ID of the authenticated user.
 * @returns A boolean indicating whether AI summary generation is enabled.
 */
export async function isAISummaryEnabled(userId: string): Promise<boolean> {
  try {
    const settings = await Settings.findOne({ userId });
    if (!settings) {
      throw new HTTPException(404, 'Settings not found');
    }
    return settings.aiSummaryEnabled;
  } catch (error) {
    throw new HTTPException(500, `Failed to fetch user settings: ${error.message}`);
  }
}