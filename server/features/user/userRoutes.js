const express = require('express');
const router = express.Router();
const userController = require('./userController');
const authMiddleware = require('../../middleware/authMiddleware');

router.get('/me', authMiddleware, userController.getMe);
router.patch('/me', authMiddleware, userController.updateMe);

module.exports = router;