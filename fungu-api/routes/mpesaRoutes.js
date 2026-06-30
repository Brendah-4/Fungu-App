const express = require('express');
const router = express.Router();
const {
  initiateContributionPayment,
  handleContributionCallback,
  checkContributionStatus,
  initiateSubscriptionPayment,
  handleSubscriptionCallback
} = require('../controllers/mpesaController');
const { protect } = require('../middleware/authMiddleware');

router.post('/contribute', protect, initiateContributionPayment);
router.post('/callback/:contributionId', handleContributionCallback);
router.get('/status/:id', protect, checkContributionStatus);
router.post('/subscribe', protect, initiateSubscriptionPayment);
router.post('/subscription-callback/:chamaId', handleSubscriptionCallback);

module.exports = router;