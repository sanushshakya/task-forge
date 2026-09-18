// app/api/entries/search/route.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware, getUserFromRequest } from '@/api/middleware/auth';
import { EntryModel } from '@/models/Entry';

/**
 * API route for searching user entries based on notes.
 * 
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
const searchEntriesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Ensure the request is authenticated
    const userId = await getUserFromRequest(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Extract search query from request query parameters
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Missing search query' });
    }

    // Build search criteria based on the query
    const searchCriteria = {
      notes: { $regex: q, $options: 'i' },
      userId,
    };

    // Perform the search in the database and limit/sort results
    const entries = await EntryModel.find(searchCriteria)
      .sort({ date: -1 }) // Sort by date descending
      .limit(20); // Limit to 20 entries

    // Return the search results
    res.status(200).json(entries);
  } catch (error) {
    console.error('Error searching entries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default authMiddleware(searchEntriesHandler);