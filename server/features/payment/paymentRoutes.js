const express = require('express');
const router = express.Router();
const paymentController = require('./paymentController');
const authMiddleware = require('../../middleware/authMiddleware');

router.post('/midtrans/notification', paymentController.notification);
router.get('/config/client-key', paymentController.getClientKey);

router.use(authMiddleware);

router.post('/', paymentController.create);
router.get('/:orderCode', paymentController.getByOrder);
router.post('/:orderCode/verify', paymentController.verify);
router.post('/snap-token', paymentController.createSnapToken);

module.exports = router;