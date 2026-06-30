const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  updatePassword,
  deleteAccount
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.delete('/profile', protect, deleteAccount);

module.exports = router;