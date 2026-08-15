const db = require('../../config/database');
const midtransClient = require('midtrans-client');
const {v4: uuidv4} = require('uuid');
const {ValidationError, NotFoundError} = require('../../utils/error');
const { VALIDATION } = require('../../utils/constant');

const IS_PROD = process.env.MIDTRANS_IS_PRODUCTION === 'true';
const MIDTRANS_BASE_URL = IS_PROD ? 'https://api.midtrans.com' : 'https://app.sandbox.midtrans.com';

const core = new midtransClient.CoreApi({
    isProduction: IS_PROD,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

const VALID_METHODS = ['card', 'bca', 'qris'];


class PaymentService {
    constructor() {
        this.core = core;
    }
    async createPayment({userId, planSlug, method, card}) {
        if (!VALID_METHODS.includes(method)) {
            throw new ValidationError('Invalid payment method');
        }
        const [plans] = await db.query(
            'SELECT * FROM subscription_plans WHERE slug = ? AND is_active = 1',
            [planSlug]
        );
        const plan = plans[0];
        if (!plan) throw new NotFoundError('Plan not found');

        const orderCode = `CHILL-${uuidv4().split('-')[0].toUpperCase()}`;
        const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const [orderRes] = await db.query(
            `INSERT INTO orders (user_id, plan_id, order_code, amount,
            status, expired_at) VALUES
            (?, ?, ?, ?, 'pending', ?)`,
            [userId, plan.id, orderCode, plan.price, expiredAt]
        );

        const [payRes] = await db.query(
            `INSERT INTO payments (order_id, payment_method, amount,
            status, payment_provider, expired_at)
            VALUES (?, ?, ?, 'pending', 'midtrans', ?)`,
            [orderRes.insertId, method, plan.price, expiredAt]
        );

        const [users] = await db.query(
            'SELECT email, full_name FROM users WHERE id = ?',
            [userId]
        );
        const user = users[0] || {};

        const chargeParam = await this._buildChargeParam({
            orderCode, plan, method, user, card
        });

        let charge;
        try {
            charge = await core.charge(chargeParam);
            console.log('[DEBUG] Midtrans charge response:', JSON.stringify(charge, null, 2));
        } catch(err) {
            await db.query('UPDATE orders SET status = ? WHERE id = ?',
                ['failed', orderRes.insertId]
            );
            await db.query('UPDATE payments SET status = ? WHERE id = ?',
                ['failed', payRes.insertId]
            );
            throw new ValidationError('Transaksi ditolak, coba metode lain');
        }

        await db.query(
            `UPDATE payments SET transaction_id = ?,
            external_payment_id = ?, transaction_status = ?
            WHERE id = ?`,
            [charge.transaction_id, charge.transaction_id, charge.transaction_status, payRes.insertId]
        );

        return {
            order: {code: orderCode, amount: Number(plan.price),
                status: 'pending', expired_at: expiredAt
            },
            payment: await this._buildPaymentResult(method, charge),
        };
    }

    async _buildChargeParam({ orderCode, plan, method, user, card}) {
        const param = {
            transaction_details: {
                order_id: orderCode,
                gross_amount: Number(plan.price),
            },
            item_details: [{
                id: String(plan.id),
                price: Number(plan.price),
                quantity: 1,
                name: plan.name,
            }],
            customer_details: {
                first_name: user.full_name || 'Customer',
                email: user.email,
            },
        };

        if (method === 'bca') {
            param.payment_type = 'bank_transfer';
            param.bank_transfer = {bank: 'bca'};
        } else if (method === 'qris') {
            param.payment_type = 'qris';
            param.qris = {acquirer: 'gopay'};
        } else if (method === 'card') {
            param.payment_type = 'credit_card';
            param.credit_card = {
                token_id: await this._getCardToken(card),
                authentication: false,
            };
        }
        return param;
    }

    async _getCardToken({ cardNumber, expMonth, expYear, cvv}) {
        const body = new URLSearchParams({
            client_key: process.env.MIDTRANS_CLIENT_KEY,
            payment_type: 'credit_card',
            card_number: cardNumber,
            card_exp_month: expMonth,
            card_exp_year: expYear,
            card_cvv: cvv,
            authentication: 'false',
        });
        const res = await fetch (`${MIDTRANS_BASE_URL}/v1/token`, {
            method: 'POST', body
        });
        const data = await res.json();
        if (!data.token_id) {
            throw new ValidationError(data.status_message || 'Kartu ditolak');
        }
        return data.token_id;
    }

    async _buildPaymentResult(method, charge) {
        if (method === 'bca') {
            const va = charge.va_numbers?.[0];
            return {
                type: 'va', 
                bank: va?.bank, 
                va_number: va?.va_number, 
                expiry_time: charge.expiry_time
            };
        } else if (method === 'qris') {
            const qr = charge.actions?.find(a => a.name === 'qr-code');
            return { 
                type: 'qris', 
                qr_url: qr?.url, 
                expiry_time: charge.expiry_time
            };

             
        }
        return {
            type: 'card', 
            transaction_status: charge.transaction_status,
            fraud_status: charge.fraud_status
        };
    }

    async processNotification({orderId, transactionStatus, fraudStatus}) {
        const [rows] = await db.query(
            `SELECT o.*, p.id AS payment_id, p.status AS
            payment_status, pl.duration_days
            FROM orders o
            JOIN payments p ON p.order_id = o.id
            JOIN subscription_plans pl ON pl.id = o.plan_id
            WHERE o.order_code = ?
            ORDER BY p.id DESC LIMIT 1`,
            [orderId]);
        const order = rows[0];
        if (!order) return null;

        // Idempotency: jika udah success, jangan proses ulang (webhook bisa double)
        if (order.payment_status === 'succeeded') {
            return { status: order.payment_status, alreadyProcessed: true};
        }

        let orderStatus = 'pending';
        let paymentStatus = 'pending';

        const isSuccess =
            transactionStatus === 'settlement' ||
            (transactionStatus === 'capture' && fraudStatus === 'accept');

            if (isSuccess) {
                orderStatus = 'paid';
                paymentStatus = 'succeeded';
            } else if (['deny', 'cancel', 'failure'].includes(
                transactionStatus
            )) {
                orderStatus = 'failed';
                paymentStatus = 'failed';
            } else if (transactionStatus === 'expire') {
                orderStatus = 'expired';
                paymentStatus = 'expired';
            }

            if (paymentStatus === 'succeeded') {
                const conn = await db.getConnection();
                try {
                    await conn.beginTransaction();
                    await conn.query(
                        `UPDATE payments SET status = ?,
                        transaction_status = ?, paid_at = NOW()
                        WHERE id = ?`, [paymentStatus, transactionStatus, order.payment_id]
                    );
                    await conn.query(
                        'UPDATE orders SET status = ? WHERE id = ?',
                        [orderStatus, order.id]
                    );
                    await conn.query(
                        `UPDATE users
                        SET is_premium = 1, subscription_expires_at = DATE_ADD(NOW(), INTERVAL ? DAY)
                        WHERE id = ?`, [order.duration_days, order.user_id]
                    );
                    await conn.commit();
                } catch(err) {
                    await conn.rollback();
                    throw err;
                } finally {
                    conn.release();
                }
            } else {
                await db.query('UPDATE payments SET status = ?, transaction_status = ? WHERE id = ?',
                    [paymentStatus, transactionStatus, order.payment_id]
                );
                await db.query('UPDATE orders SET status = ? WHERE id = ?',
                    [orderStatus, order.id]
                );
            }
            return {status: paymentStatus};
    }

    async getPaymentByOrderCode(orderCode, userId) {
        const [rows] = await db.query(
            `SELECT o.*, p.payment_method, p.status AS payment_status, 
                    p.transaction_id, p.amount, p.created_at AS payment_created_at,
                    pl.name AS plan_name, pl.price
            FROM orders o
            JOIN payments p ON p.order_id = o.id
            JOIN subscription_plans pl ON pl.id = o.plan_id
            WHERE o.order_code = ? AND o.user_id = ?
            ORDER BY p.id DESC LIMIT 1`,
            [orderCode, userId]
        );
        
        if (!rows[0]) {
            throw new NotFoundError('Order not found');
        }
        
        return rows[0];
    }
}

module.exports = new PaymentService();