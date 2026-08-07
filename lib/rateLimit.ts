import express from 'express';
import RateLimiterRedis from 'rate-limit-redis';
import Redis from 'ioredis';

const app = express();

// Create a Redis client
const redisClient = new Redis({
  host: 'localhost',
  port: 6379,
});

// Create a rate limiter using Redis
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rate-limit:',
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
});

// Apply the rate limiter middleware to all routes
app.use((req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => next())
    .catch(() => res.status(429).send('Too many requests'));
});

/**
 * Checks if a user has exceeded their request limit.
 * @param userId - The ID of the user making the request.
 * @returns A boolean indicating whether the rate limit has been exceeded.
 */
function checkRateLimit(userId: string): boolean {
  const requestCounts = new Map<string, number>();
  if (requestCounts.has(userId)) {
    requestCounts.set(userId, requestCounts.get(userId)! + 1);
    return requestCounts.get(userId)! > 10; // Limit to 10 requests per minute
  } else {
    requestCounts.set(userId, 1);
    setTimeout(() => requestCounts.delete(userId), 60 * 1000); // Reset after 1 minute
    return false;
  }
}

// Apply the rate limiter logic to specific routes if needed
app.use('/api/summary', (req, res, next) => {
  const userId = req.headers['user-id']; // Assuming user ID is passed in header for demonstration
  if (userId && checkRateLimit(userId)) {
    return res.status(429).send('Too many requests');
  }
  next();
});

export default app;