const express = require('express');
const router = express.Router();
const paymentController = require('./paymentController');
const authMiddleware = require('../../middleware/authMiddleware');

router.post('/midtrans/notification', paymentController.notification);

router.use(authMiddleware);

router.post('/', paymentController.create);
router.get('/:order-code', paymentController.getByOrder);
router.post('/:order-code/verify', paymentController.verify);

module.exports = router;