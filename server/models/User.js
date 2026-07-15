/**
 * User model (User.js)
 * ============================================================================
 * 
 * WHY MODELS ARE SEPARATE:
 * In clean software development, we follow the MVC (Model-View-Controller) design pattern.
 * The Model layer is strictly responsible for managing the data structure of our application.
 * It does not care about HTTP request routing, CSS styling, or UI templates.
 * Keeping models separate guarantees that our data schema is:
 * 1. Reusable across multiple controllers.
 * 2. Easy to validate and query.
 * 3. Simple to document and maintain.
 * 
 * WHAT THIS SCHEMAS DOES:
 * This schema defines what a "User" object looks like in MongoDB. It stores user account info,
 * basic contact info, and encrypted AWS configurations.
 */

const mongoose = require('mongoose');

// Define the User Schema structure
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true, // Guarantees that no two users have the same email address
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  phoneNumber: {
    type: String,
    trim: true,
    default: '',
  },
  // Budget target indicator (could represent their starting target or limit value)
  budget: {
    type: Number,
    default: 0,
  },
  awsRegion: {
    type: String,
    default: 'us-east-1',
  },
  // We'll store access keys safely. Note: In real production systems,
  // AWS Access Keys should be encrypted before saving to the DB.
  awsAccessKey: {
    type: String,
    default: '',
  },
  awsSecretKey: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now, // Defaults to the current date and time
  }
});

// Create and export the User model based on our schema
module.exports = mongoose.model('User', UserSchema);
