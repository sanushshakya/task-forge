import mongoose from 'mongoose';

/**
 * Define a Mongoose schema for the Entry model.
 * @property userId - The ID of the user who created the entry, required and references the User model.
 * @property date - The date of the entry, required.
 * @property tasks - An array of strings representing tasks completed, optional.
 * @property mood - A string representing the user's mood on that day, optional.
 * @property notes - Additional notes or comments about the day, optional.
 */
const entrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  tasks: {
    type: [String],
    required: false,
  },
  mood: {
    type: String,
    required: false,
  },
  notes: {
    type: String,
    required: false,
  },
});

/**
 * Create and export the Entry model.
 */
const Entry = mongoose.model('Entry', entrySchema);

export default Entry;