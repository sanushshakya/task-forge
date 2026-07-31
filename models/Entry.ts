import mongoose from 'mongoose';

/**
 * Define a Mongoose schema for the Entry model.
 * @property title - The title of the entry, required and unique.
 * @property content - The content of the entry, required.
 * @property authorId - The ID of the user who created the entry, required.
 * @property createdAt - The timestamp when the entry was created, defaulting to the current date.
 */
const entrySchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Create and export the Entry model.
 */
const Entry = mongoose.model('Entry', entrySchema);

export default Entry;