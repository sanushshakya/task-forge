import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * Define a Mongoose schema for the User model.
 * @property email - The user's email address, required and unique.
 * @property hashed_password - The hashed version of the user's password, required.
 * @property reset_token - A token for password reset purposes, optional.
 * @property reset_token_expiry - The expiry time for the password reset token, optional.
 * @property createdAt - The timestamp when the user was created, defaulting to the current date.
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  hashed_password: {
    type: String,
    required: true,
  },
  reset_token: {
    type: String,
  },
  reset_token_expiry: {
    type: Date,
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