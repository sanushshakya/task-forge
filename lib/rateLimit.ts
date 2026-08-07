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

export default app;