-- ============================================================================
-- CHILL STREAMS ROLLBACK
-- Description: Reverse all migration changes in correct order
-- Usage: Run this to completely undo all migrations
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- STEP 1: DROP ALL TABLES (reverse CREATE order)
-- ============================================================================

DROP TABLE IF EXISTS content_recommendations;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS watch_history;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS content_genres;
DROP TABLE IF EXISTS episodes;
DROP TABLE IF EXISTS contents;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS subscription_plans;

SET FOREIGN_KEY_CHECKS = 1;