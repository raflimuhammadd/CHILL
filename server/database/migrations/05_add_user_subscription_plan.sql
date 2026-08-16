-- ============================================================================
-- CHILL STREAMS DATABASE MIGRATION
-- Description: Track which subscription plan a premium user has
-- Prerequisite: 01_create_tables.sql (users, orders, payments, subscription_plans)
-- Note: MySQL tidak mendukung ADD COLUMN IF NOT EXISTS -> jalankan SEKALI pada
--       DB yang belum punya kolom ini.
-- ============================================================================

ALTER TABLE users
  ADD COLUMN subscription_plan_id SMALLINT NULL
  AFTER subscription_expires_at,
  ADD CONSTRAINT fk_users_subscription_plan
    FOREIGN KEY (subscription_plan_id) REFERENCES subscription_plans(id);

-- Backfill user premium dari pembayaran succeeded terakhir (per user)
UPDATE users u
JOIN (
    SELECT p.user_id AS user_id, MAX(p.id) AS max_payment_id
    FROM payments p
    JOIN orders o ON o.id = p.order_id
    WHERE p.status = 'succeeded'
    GROUP BY p.user_id
) latest ON latest.user_id = u.id
JOIN payments p ON p.id = latest.max_payment_id
JOIN orders o ON o.id = p.order_id
SET u.subscription_plan_id = o.plan_id
WHERE u.is_premium = 1;
