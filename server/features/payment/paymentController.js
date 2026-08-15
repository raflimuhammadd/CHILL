const paymentService = require('./paymentService');
const { success } = require('../../utils/apiResponse');

exports.create = async (req, res, next) => {
    try {
        const {plan_slug, payment_method, card} = req.body || {};
        const result = await paymentService.createPayment({
            userId: req.user.id,
            planSlug: plan_slug,
            method: payment_method,
            card
        });
        return success(res, result, 'Pembayaran dibuat', 201)
    } catch (err) {
        next (err);
    }
}

exports.verify = async (req, res, next) => {
    try {
        const orderId = req.params.order-code;
        const status = await paymentService.core.transaction.status(
            orderId
        );
        const result = await paymentService.processNotification({
            orderId: status.order_id,
            transactionStatus: status.transaction_status,
            fraudStatus: status.fraud_status,
        });
        return success(res, result, 'Status pembayaran diperbarui');
    } catch (err) {
        next (err);
    }
}

exports.notification = async (req, res, next) => {
    try {
        const notif = await paymentService.core.transaction.notification(req.body);
        await paymentService.processNotification({
            orderId: notif.order_id,
            transactionStatus: notif.transaction_status,
            fraudStatus: notif.fraud_status,
        });
        return res.status(200).json({
            status_code: 200,
            message: 'OK'
        })
    } catch (err) {
        if (err.httpStatusCode === 403 || /signature/i.test(err.message)) {
            return res.status(403).json({
                message: 'Invalid signature'
            });
        }
        console.error('[Payment] Webhook error:', err.message);
        return res.status(200).json({
            status_code: 200,
            message: 'received'
        });
    }
}

exports.getByOrder = async (req, res, next) => {
    try {
        const result = await paymentService.getPaymentByOrderCode(
            req.params.orderCode,
            req.user.id
        );
        return success(res, result);
    } catch (err) {
        next(err);
    }
};