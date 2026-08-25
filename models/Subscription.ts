// models/Subscription.ts

/**
 * Represents a subscription associated with a team.
 */
export interface Subscription {
  /**
   * The unique identifier for the subscription.
   */
  _id: string;

  /**
   * Reference to the team associated with the subscription.
   */
  teamId: string;

  /**
   * Stripe customer ID associated with the subscription.
   */
  stripeCustomerId: string;

  /**
   * Stripe subscription ID associated with the subscription.
   */
  stripeSubscriptionId: string;

  /**
   * Status of the subscription (e.g., active, cancelled).
   */
  status: 'active' | 'cancelled';

  /**
   * Plan of the subscription (e.g., basic, premium).
   */
  plan: 'basic' | 'premium';

  /**
   * Date when the current billing period ends.
   */
  currentPeriodEnd: Date;

  /**
   * Indicates whether the subscription is in a trial period.
   */
  isTrialPeriod: boolean;
}

// models/index.ts

/**
 * This module exports all models used in the application.
 */

import { Subscription } from './Subscription';

export {
  Subscription,
};