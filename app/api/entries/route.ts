/**
 * Handles entry retrieval requests for authenticated users, optionally filtering by date range and sorting by date descending.
 */
import { Request, Response } from 'express';
import EntryModel from '../models/Entry';
import authMiddleware from '../middleware/auth';

// Define validation rules for the entry retrieval request query parameters
const validateEntryRetrieval = [
  body('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO 8601 date'),
  body('endDate').optional().isISO8601().withMessage('End date must be a valid ISO 8601 date'),
];

/**
 * Retrieve the authenticated user's entries, optionally filtered by date range and sorted by date descending.
 * @param req - The incoming request object.
 * @param res - The response object.
 * @returns A response containing the user's entries or an error message.
 */
export const getEntries = async (req: Request, res: Response) => {
  // Validate the incoming request query parameters
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = (req.user as any)._id; // Cast to any to access _id property safely

    // Define the query object for filtering entries
    let query: { userId: string } & Partial<{ startDate: Date, endDate: Date }> = { userId };

    // Add date range filter if provided
    const { startDate, endDate } = req.query;
    if (startDate) {
      query.startDate = new Date(startDate as string);
    }
    if (endDate) {
      query.endDate = new Date(endDate as string);
    }

    // Retrieve the entries from the database
    const entries = await EntryModel.find(query).sort({ date: -1 });

    return res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Route handler for retrieving the authenticated user's last 7 entries, including mood scores and task completion rates.
 * @param req - The incoming request object.
 * @param res - The response object.
 * @returns A response containing the user's last 7 entries or an error message.
 */
export const getLastSevenEntries = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)._id; // Cast to any to access _id property safely

    // Define the query object for retrieving the last 7 entries
    const query = { userId };

    // Retrieve the last 7 entries from the database, sorted by date descending
    const entries = await EntryModel.find(query).sort({ date: -1 }).limit(7);

    return res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Define the route for entry retrieval
const router = require('express').Router();
router.get('/entries', authMiddleware, validateEntryRetrieval, getEntries);
router.get('/last-seven-entries', authMiddleware, getLastSevenEntries);

module.exports = router;