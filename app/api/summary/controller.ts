// app/api/summary/controller.ts

import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '@/middleware/validation';
import { SummaryRequest, SummaryResponse } from './types';
import { generateText } from '@/lib/ollama';

const router = express.Router();

/**
 * Route handler for generating entry summaries using the Ollama API.
 * @param req - The incoming request object.
 * @param res - The response object.
 * @returns A JSON response containing the generated summary or an error message.
 */
router.post('/generate', 
  [
    body('entryId').isMongoId().withMessage('Invalid entry ID'),
    validateRequest
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const { entryId } = req.body as SummaryRequest;

      // Generate the summary using the Ollama API client
      const summary = await generateText(entryId);

      return res.status(200).json({ summary });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to generate summary' });
    }
  }
);

export default router;