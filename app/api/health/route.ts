// app/api/health/route.ts

import { FastAPI } from 'fastapi';
import { MongoClient } from 'mongodb';
import getMongoClient from '@/lib/mongodb.ts';

const app = new FastAPI();

/**
 * Route handler for pinging the MongoDB connection.
 * @returns A JSON object indicating whether the MongoDB connection is healthy.
 */
app.get('/health/check', async (request: Request, response: Response) => {
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