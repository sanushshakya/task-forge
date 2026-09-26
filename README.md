// app/api/auth/reset-password/confirm/route.ts

import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import User from '@/models/User';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { token, newPassword } = req.body;

      // Find user with matching resetToken that hasn't expired
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: new Date() },
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Save the new hashed password and clear resetToken and resetTokenExpiry
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await user.save();

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error confirming password reset:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
```

// README.md

## Features

- **Email Welcome Message**: Upon successful user creation, an email with a subject "Welcome to DailyLog" and a simple HTML body greeting the user by email is sent.
- **Password Reset Confirmation**: Allows users to confirm their new password using a reset token. The token must be valid and not expired. If successful, the user's password is updated and the token is cleared.

---