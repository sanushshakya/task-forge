// models/Team.ts

import { Schema, model } from 'mongoose';
import { Types } from 'mongoose';

/**
 * Represents a Team in the system with fields for name, ownerId, members, and createdAt.
 */
const teamSchema = new Schema({
  /**
   * The name of the team.
   */
  name: {
    type: String,
    required: true,
    trim: true,
  },

  /**
   * The ID of the owner who created the team.
   */
  ownerId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },

  /**
   * An array of member IDs who are part of the team.
   */
  members: [
    {
      type: Types.ObjectId,
      ref: 'User',
      required: false,
    },
  ],

  /**
   * The timestamp when the team was created.
   */
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Mongoose model for the Team collection.
 */
const Team = model('Team', teamSchema);

export default Team;