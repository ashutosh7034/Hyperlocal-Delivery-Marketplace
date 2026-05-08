const express = require('express');
const {
  register,
  login,
  verifyEmail,
  getCurrentUser,
  googleAuth,
  facebookAuth,
  githubInit,
  githubCallback,
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.get('/current-user', verifyToken, getCurrentUser);

// Social authentication
router.post('/google', googleAuth);
router.post('/facebook', facebookAuth);
router.get('/github', githubInit);
router.get('/github/callback', githubCallback);

module.exports = router;
