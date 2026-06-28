const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
  chama: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chama',
    required: true
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['contribution', 'penalty', 'loan_repayment'],
    default: 'contribution'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending'
  },
  mpesaRef: {
    type: String
  },
  period: {
    month: { type: Number },
    year: { type: Number }
  },
  notes: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Contribution', contributionSchema);