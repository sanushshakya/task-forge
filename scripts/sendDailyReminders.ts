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

// Function to find users without today's Entry
async function findUsersWithoutEntry(): Promise<User[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight for comparison

  return User.find({
    _id: {
      $in: await Settings.find({ enableDailyReminders: true }).populate('userId').then(settings => 
        settings.map(setting => setting.userId)
      ),
    },
    _id: {
      $not: {
        $exists: {
          $elemMatch: {
            userId: { $in: Entry.distinct('userId') },
            date: {
              $gte: today,
              $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    },
  });
}

// Function to send daily reminders
async function sendDailyReminders() {
  try {
    const users = await findUsersWithoutEntry();
    for (const user of users) {
      if (user.email) {
        await resend.emails.send({
          from: 'daily-reminder@example.com',
          to: user.email,
          subject: 'Don\'t forget your daily Entry!',
          html: '<p>Hello,</p><p>Please make sure you create an Entry for today.</p>',
        });
      }
    }
  } catch (error) {
    console.error('Error sending daily reminders:', error);
  }
}

// Run the function to send daily reminders
sendDailyReminders();