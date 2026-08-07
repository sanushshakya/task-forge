import { test, expect } from 'vitest';
import rateLimiter from '@/app/api/summary/rateLimit.ts';

// Mock the checkRateLimit function for testing
const mockCheckRateLimit = jest.fn();
rateLimiter.checkRateLimit = mockCheckRateLimit;

test('should allow requests when no limit is set', async () => {
  // Reset mock calls before each test
  mockCheckRateLimit.mockReset();

  const requestMock: any = { ip: '127.0.0.1' };

  // Call the function with a mock request object
  await rateLimiter.checkRateLimit(requestMock);

  // Expect the checkRateLimit function to not have been called
  expect(mockCheckRateLimit).not.toHaveBeenCalled();
});

test('should block requests when limit is exceeded', async () => {
  // Reset mock calls before each test
  mockCheckRateLimit.mockReset();

  const requestMock: any = { ip: '127.0.0.1' };

  // Mock the behavior of checkRateLimit to return true (indicating a rate limit violation)
  mockCheckRateLimit.mockReturnValue(true);

  // Call the function with a mock request object
  await expect(rateLimiter.checkRateLimit(requestMock)).rejects.toThrow('Rate limit exceeded');

  // Expect the checkRateLimit function to have been called
  expect(mockCheckRateLimit).toHaveBeenCalledWith(requestMock);
});