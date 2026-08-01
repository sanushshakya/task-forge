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
 * Method to retrieve entries by user and date range.
 * @param userId - The ID of the user.
 * @param startDate - Optional start date for filtering.
 * @param endDate - Optional end date for filtering.
 * @returns A promise that resolves with an array of entries matching the criteria.
 */
entrySchema.statics.findByUserAndDateRange = async function (userId: mongoose.Types.ObjectId, startDate?: Date, endDate?: Date) {
  const query: any = { userId };

  if (startDate) {
    query.date = { ...query.date, $gte: startDate };
  }

  if (endDate) {
    query.date = { ...query.date, $lte: endDate };
  }

  return this.find(query).sort({ date: -1 });
};

/**
 * Create and export the Entry model.
 */
const Entry = mongoose.model('Entry', entrySchema);

export default Entry;