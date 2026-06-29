const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chama: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chama'
  },
  type: {
    type: String,
    enum: ['contribution', 'loan_request', 'loan_approved', 'loan_rejected', 'reminder', 'general'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);