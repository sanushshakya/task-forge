// models/Subscription.ts

import mongoose from 'mongoose';

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

  /**
   * Indicates whether the subscription is active.
   */
  isActive: boolean;

  /**
   * Expiration date of the subscription.
   */
  expirationDate: Date;
}

const subscriptionSchema = new mongoose.Schema<Subscription>({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
});

export const SubscriptionModel = mongoose.model<Subscription>('Subscription', subscriptionSchema);