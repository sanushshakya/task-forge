// app/api/admin/users/route.ts

import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { User, Subscription } from '@/models/User';
import { validateAdmin } from '@/api/middleware/auth';

const PAGE_SIZE = 10;

/**
 * Fetches paginated user data filtered by email if provided.
 * @param req - The request object.
 * @param res - The response object.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Validate admin access
    const userId = await validateAdmin(req, res);
    if (!userId) return;

    // Extract query parameters
    const { page = 1, email } = req.query;
    const pageNumber = parseInt(page as string, 10);

    // Build the filter based on email if provided
    const filter: any = {};
    if (email) {
      filter.email = { $regex: email.toString(), $options: 'i' };
    }

    // Count total users matching the filter
    const count = await User.countDocuments(filter);

    // Fetch paginated data
    const users = await User.find(filter)
      .skip((pageNumber - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .exec();

    // Return the paginated data and total count
    res.status(200).json({
      users,
      totalCount: count,
      pageSize: PAGE_SIZE,
      currentPage: pageNumber,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}