// lib/streak.ts
import { Entry } from '../models/Entry';

/**
 * Calculates the current consecutive-day streak counting backward from today based on entry dates.
 * @param entries - Array of entry dates.
 * @returns The length of the current consecutive-day streak.
 */
export function calculateStreak(entries: Entry[]): number {
  const today = new Date();
  const sortedEntries = entries
    .map(entry => entry.date)
    .sort((a, b) => a.getTime() - b.getTime())
    .reverse();

  let streak = 0;
  let currentDate = new Date(today);

  for (const entryDate of sortedEntries) {
    if (entryDate.toDateString() === currentDate.toDateString()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break; // Stop counting once the entries are no longer consecutive
    }
  }

  return streak;
}