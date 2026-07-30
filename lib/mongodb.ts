import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

// Create a MongoDB client instance
const uri = process.env.MONGODB_URI as string;
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