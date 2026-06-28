const express = require('express');
const router = express.Router();
const {
  makeContribution,
  getChamaContributions,
  getMyContributions,
  getMemberSummary
} = require('../controllers/contributionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, makeContribution);
router.get('/my', protect, getMyContributions);
router.get('/:chamaId', protect, getChamaContributions);
router.get('/:chamaId/summary', protect, getMemberSummary);

module.exports = router;