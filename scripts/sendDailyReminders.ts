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
}).catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
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

// Main function to send daily reminders
async function sendDailyReminders() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const usersWithoutEntry = await User.find({
      _id: {
        $not: {
          $in: Entry.find({
            date: today,
          }).distinct('userId'),
        },
      },
      isActive: true,
      'settings.enableDailyReminders': true,
    });

    for (const user of usersWithoutEntry) {
      try {
        await resend.emails.send({
          from: 'daily-reminder@example.com',
          to: user.email,
          subject: 'Reminder: Log Your Entry Today!',
          html: `<p>Hi ${user.username},</p><p>Please log your entry for today.</p><p>Best regards,</p><p>Your Daily Reminder System</p>`,
        });
        console.log(`Sent reminder to ${user.email}`);
      } catch (error) {
        console.error(`Failed to send reminder to ${user.email}`, error);
      }
    }

    console.log('Daily reminders sent successfully');
  } catch (error) {
    console.error('Error sending daily reminders:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Run the main function
sendDailyReminders().catch((error) => {
  console.error('Unhandled error in sendDailyReminders:', error);
  process.exit(1);
});