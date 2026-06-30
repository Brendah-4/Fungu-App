const express = require('express');
const router = express.Router();
const {
  createChama,
  joinChama,
  getMyChamas,
  getChamaById,
  updateChama,
  removeMember,
  changeMemberRole
} = require('../controllers/chamaController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createChama);
router.post('/join', protect, joinChama);
router.get('/my', protect, getMyChamas);
router.get('/:id', protect, getChamaById);
router.put('/:id', protect, updateChama);
router.delete('/:chamaId/members/:memberId', protect, removeMember);
router.put('/:chamaId/members/:memberId/role', protect, changeMemberRole);

module.exports = router;