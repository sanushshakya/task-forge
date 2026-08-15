import { FastAPI, HTTPException, Request, Response } from 'fastapi';
import { Depends, Post } from 'fastapi.decorator';
import { MongoClient } from 'mongodb';

// Import custom dependencies
import getMongoClient from '@/lib/mongodb.ts';

const app = new FastAPI();

/**
 * Route handler for pinging the MongoDB connection.
 * @returns A JSON object indicating whether the MongoDB connection is healthy.
 */
app.post('/health/check', async (request: Request, response: Response) => {
  try {
    const client: MongoClient = await getMongoClient();
    await client.db('test').command({ ping: 1 });
    return response.json({ message: 'MongoDB connection is healthy.' });
  } catch (error) {
    throw new HTTPException(
      status_code=503,
      detail='MongoDB connection is not healthy.'
    );
  }
});