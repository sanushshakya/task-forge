---
# README.md

## Features

- **Email Welcome Message**: Upon successful user creation, an email with a subject "Welcome to DailyLog" and a simple HTML body greeting the user by email is sent.
---

// models/User.ts

/**
 * Represents a user in the application with an optional team association and admin status.
 */
export interface User {
  /**
   * The unique identifier for the user.
   */
  _id: string;

  /**
   * The username of the user.
   */
  username: string;

  /**
   * The email address of the user.
   */
  email: string;

  /**
   * Indicates whether the user's account is active.
   */
  isActive: boolean;

  /**
   * Optional reference to a team associated with the user.
   */
  teamId?: string;

  /**
   * Indicates whether the user has admin privileges.
   */
  isAdmin: boolean;
}

// app/api/auth/signup/route.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '@/utils/sendEmail'; // Assuming this utility function exists to handle email sending
import User from '@/models/User';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { username, email } = req.body;

      // Create user in the database
      const newUser = new User({ username, email });
      await newUser.save();

      // Send welcome email to the new user
      await sendEmail(email, 'Welcome to DailyLog', `
        <h1>Welcome to DailyLog!</h1>
        <p>Hi ${username}, thank you for joining DailyLog. We're excited to have you on board.</p>
        <p>Get started today and keep track of your daily activities with ease.</p>
      `);

      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;