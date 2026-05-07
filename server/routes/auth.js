const express = require('express');
const {
  register,
  login,
  verifyEmail,
  getCurrentUser,
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.get('/current-user', verifyToken, getCurrentUser);

module.exports = router;
