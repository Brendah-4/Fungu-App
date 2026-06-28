const express = require('express');
const router = express.Router();
const {
  requestLoan,
  voteLoan,
  getChamaLoans,
  getMyLoans,
  repayLoan
} = require('../controllers/loanController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, requestLoan);
router.post('/:id/vote', protect, voteLoan);
router.post('/:id/repay', protect, repayLoan);
router.get('/my', protect, getMyLoans);
router.get('/:chamaId', protect, getChamaLoans);

module.exports = router;