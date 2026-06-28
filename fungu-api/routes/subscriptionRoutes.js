const express = require('express');
const router = express.Router();
const {
  getSubscriptionStatus,
  activateSubscription,
  getAllSubscriptions
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/status/:chamaId', protect, getSubscriptionStatus);
router.post('/activate', protect, activateSubscription);
router.get('/all', protect, getAllSubscriptions);

module.exports = router;