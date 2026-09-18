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
  enableDailyReminders: { type: Boolean, default: true },
});

interface Settings extends Document {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  enableDailyReminders: boolean;
}

const Settings: Model<Settings> = mongoose.model<Settings>('Settings', settingsSchema);

/**
 * Sends daily reminders to users without entries for today.
 */
async function sendDailyReminders() {
  try {
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all active users who don't have an entry for today
    const usersWithoutEntryForToday: User[] = await User.find({
      isActive: true,
      _id: {
        $nin: await Entry.distinct('userId', {
          date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
        }),
      },
    });

    // Find users with enabled daily reminders
    const usersWithEnabledReminders = await Settings.find({
      userId: { $in: usersWithoutEntryForToday.map(user => user._id) },
      enableDailyReminders: true,
    }).populate('userId');

    // Send email reminders to each user with enabled reminders
    for (const user of usersWithEnabledReminders) {
      const { username, email } = user.userId as User;
      await resend.emails.send({
        from: 'daily-reminder@yourdomain.com',
        to: email,
        subject: 'Daily Reminder',
        text: `Hello ${username}, it's time to make your daily entry!`,
      });
    }

    console.log('Daily reminders sent successfully.');
  } catch (error) {
    console.error('Failed to send daily reminders:', error);
  }
}

// Run the function
sendDailyReminders();