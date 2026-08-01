/**
 * Handles entry creation requests with authentication and upsert functionality based on today's date.
 */
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import EntryModel from '../models/Entry';
import authMiddleware from '../middleware/auth';

// Define validation rules for the entry creation request
const validateEntryCreation = [
  body('title').trim().isLength({ min: 1 }).withMessage('Title must be at least 1 character long'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content must be at least 1 character long'),
];

/**
 * Create a new entry or update an existing one if it already exists based on today's date.
 * @param req - The incoming request object.
 * @param res - The response object.
 * @returns A response indicating success or failure.
 */
export const createEntry = async (req: Request, res: Response) => {
  // Validate the incoming request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, content } = req.body;
    const userId = (req.user as any)._id; // Cast to any to access _id property safely
    const date = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // Check if an entry already exists with the same title for today's date
    const existingEntry = await EntryModel.findOne({ title, userId, date });

    if (existingEntry) {
      // Update the existing entry
      existingEntry.content = content;
      await existingEntry.save();
      return res.status(200).json(existingEntry);
    } else {
      // Create a new entry with today's date
      const newEntry = new EntryModel({
        title,
        content,
        userId,
        date, // Add the date field to the entry
      });
      await newEntry.save();
      return res.status(201).json(newEntry);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Define the route for entry creation
const router = require('express').Router();
router.post('/entries', authMiddleware, validateEntryCreation, createEntry);

module.exports = router;