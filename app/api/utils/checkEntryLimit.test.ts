// app/api/utils/checkEntryLimit.test.ts

import { checkEntryLimit } from '../checkEntryLimit';

describe('checkEntryLimit', () => {
  it('returns true if the user has not reached the entry limit', async () => {
    const user = {
      _id: 'user123',
      entriesCount: 5,
      plan: 'Free',
    };

    const result = await checkEntryLimit(user);

    expect(result).toBe(true);
  });

  it('returns false if the user has reached the entry limit', async () => {
    const user = {
      _id: 'user123',
      entriesCount: 10,
      plan: 'Free',
    };

    const result = await checkEntryLimit(user);

    expect(result).toBe(false);
  });

  it('returns false if the user is on a paid plan', async () => {
    const user = {
      _id: 'user123',
      entriesCount: 10,
      plan: 'Pro',
    };

    const result = await checkEntryLimit(user);

    expect(result).toBe(true);
  });
});