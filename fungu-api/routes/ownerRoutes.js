const express = require('express');
const router = express.Router();
const { getOwnerStats } = require('../controllers/ownerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getOwnerStats);

module.exports = router;