// app/api/auth/reset-password/request/route.ts

import { Request, Response } from 'express';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { User } from '@/models/User';
import { sendEmail } from '@/lib/email';

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

    // Set the expiry time for the reset token (e.g., 1 hour from now)
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

    // Update the user's document with the reset token and its expiry
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          resetToken,
          resetTokenExpiry,
        },
      }
    );

    // Construct the reset URL
    const resetUrl = `https://example.com/reset-password?token=${resetToken}`;

    // Send the reset email with the reset link
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: `You are receiving this because you (or someone else) have requested a password reset for your account.\n\nPlease click on the following link, or paste it into your browser to complete the process:\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`,
    });

    return res.status(200).json({ message: 'Password reset request initiated' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to initiate password reset request', error: error.message });
  }
}