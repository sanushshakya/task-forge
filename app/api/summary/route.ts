// app/api/summary/route.ts

import express from 'express';
import SummaryController from './controller';
import checkRateLimit from '@/lib/rate-limit';

const router = express.Router();

/**
 * Route handler for generating entry summaries using the Ollama API.
 */
router.post('/', checkRateLimit, SummaryController.generateSummary);

export default router;