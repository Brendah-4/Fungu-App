const express = require('express');
const router = express.Router();
const {
  createChama,
  joinChama,
  getMyChamas,
  getChamaById,
  updateChama
} = require('../controllers/chamaController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createChama);
router.post('/join', protect, joinChama);
router.get('/my', protect, getMyChamas);
router.get('/:id', protect, getChamaById);
router.put('/:id', protect, updateChama);

module.exports = router;