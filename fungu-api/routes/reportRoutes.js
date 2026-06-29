const express = require('express');
const router = express.Router();
const { downloadFinancialStatement } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/statement/:chamaId', protect, downloadFinancialStatement);

module.exports = router;