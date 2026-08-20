import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
import { MONGODB_URI } from '../env';

// MongoDB Atlas connection string for production
const uri = process.env.MONGODB_ATLAS_URI as string;
if (!uri) {
  throw new Error('MONGODB_ATLAS_URI environment variable is missing');
}

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let client: MongoClient | null = null;

/**
 * Get a cached MongoDB connection using mongoose.
 * @returns A promise that resolves to the Mongoose connection.
 */
export async function getMongoConnection(): Promise<mongoose.Connection> {
  if (!client) {
    client = await MongoClient.connect(uri, options);
  }

  const db = client.db('task');
  return db.connection;
}