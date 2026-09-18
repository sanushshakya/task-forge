// models/index.ts

/**
 * This module exports all models used in the application.
 */

import { Team } from './Team';
import { Subscription } from './Subscription';

export {
  Team,
  Subscription,
};
```

```typescript
// models/Subscription.ts

/**
 * Represents a subscription associated with a user.
 */
export interface Subscription {
  /**
   * The unique identifier for the subscription.
   */
  _id: string;

  /**
   * Reference to the user associated with the subscription.
   */
  userId: mongoose.Types.ObjectId;
}
```

```typescript
// models/User.ts

/**
 * Represents a user in the application with an optional team association.
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
  teamId?: mongoose.Types.ObjectId;
}
```

```typescript
// models/Settings.ts

/**
 * Represents settings for a user.
 */
export interface Settings {
  /**
   * The unique identifier for the settings.
   */
  _id: string;

  /**
   * Reference to the user associated with the settings.
   */
  userId: mongoose.Types.ObjectId;

  /**
   * Indicates whether daily reminders are enabled.
   */
  enableDailyReminders: boolean;
}
```

```typescript
// scripts/sendDailyReminders.ts

import { createClient } from 'resend';
import mongoose, { Document, Model, Schema } from 'mongoose';

// Initialize Resend client with your API key
const resend = createClient(process.env.RESEND_API_KEY || '');

// MongoDB connection URI (replace with your actual MongoDB URI)
const mongoUri = process.env.MONGODB_URI || '';

// Connect to MongoDB
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Entry schema
const entrySchema = new Schema<Entry>({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
});

interface Entry extends Document {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: Date;
}

const Entry: Model<Entry> = mongoose.model<Entry>('Entry', entrySchema);

// Define the User schema
const userSchema = new Schema<User>({
  _id: { type: mongoose.Types.ObjectId, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  teamId: { type: mongoose.Types.ObjectId, ref: 'Team' },
});

interface User extends Document {
  _id?: mongoose.Types.ObjectId;
  username: string;
  email: string;
  isActive: boolean;
  teamId?: mongoose.Types.ObjectId;
}

const User: Model<User> = mongoose.model<User>('User', userSchema);

// Define the Settings schema
const settingsSchema = new Schema<Settings>({
  _id: { type: mongoose.Types.ObjectId, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  enableDailyReminders: { type: Boolean, default: false },
});

interface Settings extends Document {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  enableDailyReminders: boolean;
}

const Settings: Model<Settings> = mongoose.model<Settings>('Settings', settingsSchema);

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

    // Find users with enabled daily reminders
    const userSettings = await Settings.find({
      userId: { $in: usersWithoutTodayEntry.map(user => user._id) },
      enableDailyReminders: true,
    });

    if (userSettings.length === 0) {
      console.log('No users with daily reminders enabled.');
      return;
    }

    // Send reminders to each user
    for (const user of userSettings) {
      try {
        await resend.emails.send({
          from: 'your-email@example.com',
          to: user.userId.email,
          subject: 'Reminder: Log Your Entry Today!',
          text: `Hello ${user.userId.username},\n\nPlease remember to log your entry for today. Thank you!\n\nBest regards,\nThe Team`,
        });
        console.log(`Reminder sent to ${user.userId.email}`);
      } catch (error) {
        console.error(`Failed to send reminder to ${user.userId.email}:`, error);
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