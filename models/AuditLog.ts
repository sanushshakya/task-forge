// models/AuditLog.ts

import mongoose from 'mongoose';
import { User } from './User'; // Import the User model from models/User.ts

/**
 * Represents an audit log entry for tracking actions performed by users.
 */
export interface AuditLog {
  /**
   * The unique identifier for the audit log entry.
   */
  _id: string;

  /**
   * The ID of the user who performed the action.
   */
  userId: mongoose.Types.ObjectId;

  /**
   * The type of action performed.
   */
  action: string;

  /**
   * Additional metadata related to the action, if any.
   */
  metadata?: any;

  /**
   * The timestamp when the action was performed.
   */
  createdAt: Date;
}

/**
 * Mongoose schema for the AuditLog model.
 */
const auditLogSchema = new mongoose.Schema<AuditLog>({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Mongoose model for the AuditLog.
 */
const AuditLogModel = mongoose.model<AuditLog>('AuditLog', auditLogSchema);

export default AuditLogModel;