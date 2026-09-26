// routes/auth/reset-password/confirm/route.ts

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../models/User';

const router = express.Router();

/**
 * POST /auth/reset-password/confirm - Confirm password reset and update user's password.
 *
 * @param {string} token - The reset token sent to the user's email.
 * @param {string} newPassword - The new password to be set by the user.
 */
router.post('/', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Invalid request parameters' });
  }

  try {
    // Decode the reset token to get the user ID
    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
    const userId = decoded.userId;

    // Find the user with the matching resetToken that hasn't expired
    const user = await User.findOne({
      _id: userId,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password and clear the resetToken and resetTokenExpiry
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    // Generate a new JWT token for the updated user
    const payload = { userId: user._id };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Password reset successful', token: jwtToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;