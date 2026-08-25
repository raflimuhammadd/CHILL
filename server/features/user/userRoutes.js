const express = require('express');
const router = express.Router();
const userController = require('./userController');
const authMiddleware = require('../../middleware/authMiddleware');
const optionalAuthMiddleware = require('../../middleware/optionalAuthMiddleware');

router.get('/me', optionalAuthMiddleware, userController.getMe);
router.patch('/me', authMiddleware, userController.updateMe);

router.get('/favorites', authMiddleware, userController.getFavorites);
router.post('/favorites', authMiddleware, userController.addFavorite);
router.delete('/favorites/:contentId', authMiddleware, userController.removeFavorite);
router.get('/favorites', authMiddleware, userController.getFavorites);
router.post('/favorites', authMiddleware, userController.addFavorite);
router.delete('/favorites/:contentId', authMiddleware, userController.removeFavorite);


module.exports = router;