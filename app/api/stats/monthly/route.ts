// app/api/stats/monthly/route.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getAuthUser } from '@/auth/dependencies';
import { User, Subscription } from "@/models";

/**
 * @swagger
 * /api/stats/monthly:
 *   get:
 *     summary: Get monthly stats for the authenticated user.
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: The month for which to retrieve stats (YYYY-MM).
 *     responses:
 *       200:
 *         description: Monthly stats successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   mood:
 *                     type: string
 *                   taskCompletionRate:
 *                     type: number
 *       400:
 *         description: Invalid month format.
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { month } = req.query;
  if (!month || typeof month !== 'string') {
    return res.status(400).json({ message: 'Invalid month format' });
  }

  try {
    // Decode JWT token to get user ID
    const userId = await getAuthUser(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Retrieve monthly stats for the user and month
    const stats = await fetchMonthlyStats(userId, month);

    // Return stats in JSON format
    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Fetches monthly stats for a user and month.
 * @param userId - The ID of the user.
 * @param month - The month in YYYY-MM format.
 * @returns Array of objects containing date, mood, and task completion rate.
 */
async function fetchMonthlyStats(userId: string, month: string): Promise<{ date: string; mood: string; taskCompletionRate: number }[]> {
  // Implement logic to fetch monthly stats from the database using Mongoose aggregation
  try {
    const stats = await Subscription.aggregate([
      {
        $match: { userId }
      },
      {
        $unwind: '$monthlyStats'
      },
      {
        $match: { 
          'monthlyStats.month': month, 
          'monthlyStats.isActive': true 
        }
      },
      {
        $project: {
          date: '$monthlyStats.date',
          mood: '$monthlyStats.mood',
          taskCompletionRate: '$monthlyStats.taskCompletionRate'
        }
      }
    ]);

    return stats;
  } catch (error) {
    console.error('Error fetching monthly stats:', error);
    throw new Error('Failed to fetch monthly stats');
  }
}