import mongoose from 'mongoose';

// Define a Mongoose schema for the User model
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

// Check if the model is already compiled
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;