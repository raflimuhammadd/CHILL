const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', contentController.getAllContents);
router.get('/search', contentController.searchContents);
router.get('/:id', contentController.getContentById);
router.get('/:id/episodes', contentController.getEpisodes);
router.get('/:id/recommendations', contentController.getRecommendations);
router.get('/slug/:slug', contentController.getContentBySlug);

module.exports = router;