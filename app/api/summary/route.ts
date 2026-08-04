// app/api/summary/route.ts

import { Request, Response } from 'express';
import SummaryController from './controller';

const router = express.Router();

/**
 * Route handler for generating entry summaries using the Ollama API.
 */
router.post('/', SummaryController.generateSummary);

export default router;