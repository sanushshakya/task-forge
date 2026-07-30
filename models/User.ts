import mongoose from 'mongoose';

/**
 * Define a Mongoose schema for the User model.
 * @property email - The user's email address, required and unique.
 * @property passwordHash - The hashed version of the user's password, required.
 * @property createdAt - The timestamp when the user was created, defaulting to the current date.
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Check if the User model is already compiled.
 * @returns The User model or create a new one using the userSchema.
 */
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;