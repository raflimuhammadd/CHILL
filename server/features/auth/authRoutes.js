const express = require('express');
const router = express.Router();
const authController = require('../../features/auth/authController');
const authMiddleware = require('../../middleware/authMiddleware');
const {authLimiter, strictLimiter} = require('../../middleware/rateLimiter');

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/verify-email', authLimiter, authController.verifyEmail);
router.post('/resend-verification', authMiddleware, authLimiter, authController.resendVerification);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authMiddleware, strictLimiter, authController.logout);

module.exports = router;