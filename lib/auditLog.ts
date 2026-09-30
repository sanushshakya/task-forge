// lib/auditLog.ts

/**
 * Module containing functions for logging actions in the application.
 */

import { connect } from 'mongoose';
import { Client } from 'redis';

// MongoDB connection configuration
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';

// Redis connection configuration
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Connect to MongoDB and Redis
connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
const redisClient = new Client(redisUrl);

/**
 * Logs an action with the given user ID, action type, and metadata.
 *
 * @param userId - The ID of the user performing the action.
 * @param action - A string describing the action performed.
 * @param metadata - Additional data related to the action.
 */
export async function logAction(userId: string, action: string, metadata?: any): Promise<void> {
  try {
    // Log action in MongoDB
    await Action.create({
      userId,
      action,
      metadata,
      timestamp: new Date(),
    });

    // Log action in Redis for caching purposes
    redisClient.publish('auditLog', JSON.stringify({ userId, action, metadata, timestamp: new Date() }));
  } catch (error) {
    console.error('Error logging action:', error);
  }
}

// MongoDB schema for AuditLog
import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  action: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
});

export const Action = mongoose.model('Action', auditLogSchema);