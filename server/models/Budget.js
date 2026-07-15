/**
 * Budget model (Budget.js)
 * ============================================================================
 * 
 * WHY MODELS ARE SEPARATE:
 * Separate models allow us to build a relational mapping even inside a NoSQL database like MongoDB.
 * The Budget model stores individual records of custom spending limits that map to a User.
 * This separation helps us run targeted audits, run batch alerting triggers, and updates the budgets
 * independently from general user profile details (such as login password/email updates).
 * 
 * FIELDS IN THIS MODEL:
 * - userId: References the User ID in the User collection.
 * - monthlyLimit: The cap threshold set by the user (e.g. $1000).
 * - currentCost: The actual calculated spending from AWS Cost Explorer.
 * - alertSent: Boolean trigger to prevent spamming SMS/email notifications.
 */

const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  // Relational reference: Links this budget profile to a specific User
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Budget must belong to a user'],
  },
  monthlyLimit: {
    type: Number,
    required: [true, 'Please provide a monthly spending limit'],
    default: 0,
  },
  currentCost: {
    type: Number,
    default: 0,
  },
  // Keeps track of whether an SNS alert was already dispatched for this billing period,
  // preventing the backend from continuously sending redundant SMS texts.
  alertSent: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true // Automatically generates "createdAt" and "updatedAt" fields for tracking
});

module.exports = mongoose.model('Budget', BudgetSchema);
