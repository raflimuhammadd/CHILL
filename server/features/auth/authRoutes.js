const express = require('express');
const router = express.Router();
const authController = require('../../features/auth/authController');
const authMiddleware = require('../../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authMiddleware, authController.resendVerification);

module.exports = router;