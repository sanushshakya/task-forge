// lib/env.ts

import { z } from 'zod';

// Define a schema for the environment variables
const envSchema = z.object({
  MONGODB_URI: z.string().url().describe('The MongoDB connection string'),
});

// Parse the environment variables and validate them
export const env = envSchema.parse(process.env);

// Function to initialize the MongoDB connection using mongoose
import { connect } from 'mongoose';

export async function connectToMongoDB(): Promise<void> {
  try {
    await connect(env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw error;
  }
}