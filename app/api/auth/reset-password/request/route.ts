// app/api/auth/reset-password/request/route.ts

import { Request, Response } from 'express';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { User } from '@/models/User';

/**
 * Route handler for initiating a password reset request.
 * @param req - The Express request object containing the user's email.
 * @param res - The Express response object to send the result of the operation.
 */
export async function initiateResetPasswordRequest(req: Request, res: Response): Promise<void> {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token using crypto.randomBytes for added security
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Send the reset token to the user's email (this step would typically involve an email service)
    // For demonstration purposes, we'll just log it here
    console.log(`Reset Token for ${user.email}: ${resetToken}`);

    return res.status(200).json({ message: 'Password reset request initiated' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to initiate password reset request', error: error.message });
  }
}