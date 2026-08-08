const express = require('express');
const router = express.Router();
const watchHistoryController = require('../controllers/watchHistoryController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.get('/', authMiddleware, watchHistoryController.getWatchHistory);
router.post('/', authMiddleware, watchHistoryController.addWatchHistory);
router.patch('/:contentId', authMiddleware, watchHistoryController.updateWatchHistory);
router.delete('/:contentId', authMiddleware, watchHistoryController.deleteWatchHistory);

module.exports = router;