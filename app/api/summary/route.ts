// app/api/summary/route.ts

import express from 'express';
import SummaryController from './controller';
import checkRateLimit from '@/lib/rate-limit';

const router = express.Router();

/**
 * Helper function to check if AI summary generation is enabled for a user.
 * @param userId - The ID of the user.
 * @returns A boolean indicating whether AI summary generation is enabled.
 */
async function isAISummaryEnabled(userId: string): Promise<boolean> {
  // Import the settings service
  const settingsService = require('@/app/api/settings/service');

  // Retrieve the user's settings
  const settings = await settingsService.getSettings(userId);

  // Check if AI summary generation is enabled
  return settings.aiSummaryEnabled;
}

/**
 * Route handler for generating entry summaries using the Ollama API.
 */
router.post('/', checkRateLimit, async (req: express.Request, res: express.Response) => {
  try {
    const userId = req.user.userId; // Assuming the user ID is available from the request

    if (await isAISummaryEnabled(userId)) {
      await SummaryController.generateSummary(req, res);
    } else {
      res.status(403).json({ message: 'AI summary disabled' });
    }
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

export default router;