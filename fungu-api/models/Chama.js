const mongoose = require('mongoose');

const chamaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  inviteCode: {
    type: String,
    unique: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: { type: String, enum: ['chairperson', 'treasurer', 'secretary', 'member'], default: 'member' },
      joinedAt: { type: Date, default: Date.now }
    }
  ],
  rules: {
    contributionAmount: { type: Number, required: true },
    contributionFrequency: { type: String, enum: ['weekly', 'monthly'], default: 'monthly' },
    contributionDay: { type: Number },
    penaltyAmount: { type: Number, default: 0 },
    maxLoanMultiplier: { type: Number, default: 3 }
  },
  balance: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Chama', chamaSchema);