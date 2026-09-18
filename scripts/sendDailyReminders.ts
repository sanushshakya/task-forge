// scripts/sendDailyReminders.ts

import { createClient } from 'resend';
import mongoose from 'mongoose';
import { User } from '../models/User';

// Initialize Resend client with your API key
const resend = createClient(process.env.RESEND_API_KEY || '');

// MongoDB connection URI (replace with your actual MongoDB URI)
const mongoUri = process.env.MONGODB_URI || '';

// Connect to MongoDB
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the interface for the Entry document
interface Entry {
  _id: mongoose.Types.ObjectId;
  userId: string;
  date: Date;
}

// Function to fetch users without today's entry and send reminders
async function sendDailyReminders() {
  try {
    // Get today's date in UTC
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find users who do not have an entry for today
    const usersWithoutTodayEntry = await User.find({
      _id: {
        $not: {
          $in: await Entry.distinct('userId', { date: { $gte: today } }),
        },
      },
    });

    if (usersWithoutTodayEntry.length === 0) {
      console.log('No users without today\'s entry to remind.');
      return;
    }

    // Send reminders to each user
    for (const user of usersWithoutTodayEntry) {
      try {
        await resend.emails.send({
          from: 'your-email@example.com',
          to: user.email,
          subject: 'Reminder: Log Your Entry Today!',
          text: `Hello ${user.username},\n\nPlease remember to log your entry for today. Thank you!\n\nBest regards,\nThe Team`,
        });
        console.log(`Reminder sent to ${user.email}`);
      } catch (error) {
        console.error(`Failed to send reminder to ${user.email}:`, error);
      }
    }

    console.log('Reminders sent successfully.');
  } catch (error) {
    console.error('Error fetching users without today\'s entry:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
  }
}

// Run the reminder function
sendDailyReminders().catch(console.error);
```

This script connects to a MongoDB database, finds users who do not have an entry for today, and sends them reminders via email using the Resend API. Make sure to replace placeholders like `RESEND_API_KEY`, `MONGODB_URI`, and email details with actual values.