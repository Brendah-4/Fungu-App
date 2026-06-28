const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
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
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'disbursed', 'repaid'],
    default: 'pending'
  },
  votes: [
    {
      member: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      vote: { type: String, enum: ['approve', 'reject'] },
      votedAt: { type: Date, default: Date.now }
    }
  ],
  interestRate: {
    type: Number,
    default: 5
  },
  totalRepayable: {
    type: Number
  },
  amountRepaid: {
    type: Number,
    default: 0
  },
  dueDate: {
    type: Date
  },
  disbursedAt: {
    type: Date
  },
  repaidAt: {
    type: Date
  },
  platformFee: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);