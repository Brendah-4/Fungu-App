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
  },
  subscription: {
    plan: { type: String, enum: ['trial', 'basic', 'premium'], default: 'trial' },
    status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
    trialStartDate: { type: Date, default: Date.now },
    trialEndDate: { type: Date },
    paidUntil: { type: Date },
    mpesaRef: { type: String }
  }
}, { timestamps: true });

chamaSchema.pre('save', function(next) {
  if (!this.subscription.trialEndDate) {
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 30);
    this.subscription.trialEndDate = trialEnd;
  }
  next();
});

chamaSchema.methods.isSubscriptionActive = function() {
  const now = new Date();
  if (this.subscription.plan === 'trial') {
    return now < this.subscription.trialEndDate;
  }
  return this.subscription.status === 'active' && now < this.subscription.paidUntil;
};

module.exports = mongoose.model('Chama', chamaSchema);