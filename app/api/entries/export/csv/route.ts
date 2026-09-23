/**
 * Handles exporting user entries as CSV with authentication middleware.
 */

import express from 'express';
import { User } from '@/models/User';
import { Entry } from '@/models/Entry'; // Assuming an Entry model exists
import csvWriter from 'csv-writer';

// Import the authentication middleware
import { authenticateToken } from '@/api/middleware/auth';

const router = express.Router();

/**
 * GET /api/entries/export/csv - Export user entries as CSV.
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId; // Assume auth middleware sets this

    // Fetch all entries for the authenticated user
    const entries = await Entry.find({ userId });

    if (!entries.length) {
      return res.status(404).send('No entries found for this user.');
    }

    // Create a CSV writer instance
    const createCsvWriter = csvWriter.createObjectCsvWriter;
    const csvWriterInstance = createCsvWriter({
      header: [
        { id: 'id', title: 'ID' },
        { id: 'createdAt', title: 'Created At' },
        { id: 'updatedAt', title: 'Updated At' },
        { id: 'notes', title: 'Notes' },
        // Add more fields as necessary
      ],
    });

    // Convert entries to CSV format manually
    const csvData = entries.map(entry => ({
      id: entry._id.toString(),
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
      notes: entry.notes,
      // Map other fields as necessary
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=user_entries.csv');

    const csvString = csvWriterInstance.toString(csvData);
    res.send(csvString);

  } catch (error) {
    console.error('Error exporting entries as CSV:', error);
    return res.status(500).send('Internal Server Error.');
  }
});

export default router;