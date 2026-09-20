// app/api/entries/search.tsx

/**
 * This API route handles searching entries based on a search query using debounced text input.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/db/connect';
import { Entry } from '@/models/Entry';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { query } = req;

  // Connect to MongoDB database
  await connectToDatabase();

  if (method === 'GET') {
    try {
      const searchQuery = query.q as string;

      // Search entries by notes using a regex pattern for case-insensitive matching
      const entries = await Entry.find({
        notes: { $regex: searchQuery, $options: 'i' },
      });

      res.status(200).json(entries);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}