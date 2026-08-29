// app/api/utils/checkEntryLimit.ts

/**
 * This module contains utility functions for handling entry limit checks.
 */

import { User } from "../../models/User";
import { Subscription } from "../../models/Subscription";

/**
 * Checks if the user has reached their entry limit.
 *
 * @param {User} user - The user object to check.
 * @returns {Promise<boolean>} A promise that resolves to true if the user has not reached their limit, false otherwise.
 */
export async function checkEntryLimit(user: User): Promise<boolean> {
  // Retrieve the subscription for the user
  const subscription = await Subscription.findOne({ userId: user._id });

  // If no subscription is found, assume the user is on a free plan with no limit
  if (!subscription) return true;

  // Get the number of entries the user has made
  const entryCount = await Entry.countDocuments({ userId: user._id });

  // Check if the user has exceeded their entry limit
  return entryCount < subscription.entryLimit;
}