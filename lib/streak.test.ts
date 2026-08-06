// lib/streak.test.ts

import { calculateStreak } from './streak';

describe('calculateStreak', () => {
  it('should return 0 for no entries', () => {
    const entries: Date[] = [];
    expect(calculateStreak(entries)).toBe(0);
  });

  it('should return 1 for one entry on the same day as today', () => {
    const today = new Date();
    const entries: Date[] = [today];
    expect(calculateStreak(entries)).toBe(1);
  });

  it('should return 3 for three consecutive days in reverse order', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

    const entries: Date[] = [today, yesterday, dayBeforeYesterday];
    expect(calculateStreak(entries)).toBe(3);
  });

  it('should return 2 for two consecutive days with a gap', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const entries: Date[] = [today, yesterday, new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3)];
    expect(calculateStreak(entries)).toBe(2);
  });

  it('should return 0 for entries that are not consecutive', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

    const entries: Date[] = [today, new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3), yesterday];
    expect(calculateStreak(entries)).toBe(0);
  });
});