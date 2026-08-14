const express = require('express');
const router = express.Router();
const uploadService = require('./uploadService');
const uploadController = require('./uploadController');
const authMiddleware = require('../../middleware/authMiddleware');

router.post('/',
    authMiddleware,
    uploadService.single('avatar'),
    uploadController.uploadAvatar
);

module.exports = router;