const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  chama: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chama',
    required: true
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free'
  },
  amount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  mpesaRef: {
    type: String
  },
  autoRenew: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);