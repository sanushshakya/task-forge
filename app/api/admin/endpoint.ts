// app/api/admin/endpoint.ts

/**
 * This file contains the API endpoint for fetching admin statistics.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { getAdminStats } from '@/services/adminService';

/**
 * Handler for fetching admin statistics.
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const stats = await getAdminStats();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch admin statistics' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}