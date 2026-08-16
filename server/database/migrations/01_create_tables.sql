-- ============================================================================
-- CHILL STREAMS DATABASE MIGRATION
-- Description: Create all tables with proper FK relationships and indexes
-- Order: DROP children first, then CREATE parents first
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- STEP 1: DROP EXISTING TABLES (Clean Slate)
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

-- ============================================================================
-- STEP 2: CREATE TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE: subscription_plans
-- ----------------------------------------------------------------------------

CREATE TABLE subscription_plans (
  id SMALLINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT 'Display name: Individual, Berdua, Keluarga',
  slug VARCHAR(100) UNIQUE NOT NULL COMMENT 'URL-friendly: individual, duo, family',
  description TEXT COMMENT 'Marketing description',
  price DECIMAL(12,2) NOT NULL COMMENT 'Monthly price in IDR',
  duration_days SMALLINT NOT NULL DEFAULT 30 COMMENT 'Subscription duration',
  quality VARCHAR(20) COMMENT 'Video quality: 720p, 1080p, 4K',
  is_active TINYINT(1) DEFAULT 1 COMMENT 'Active plans shown to users',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Subscription plan tiers';

-- ----------------------------------------------------------------------------
-- TABLE: users
-- ----------------------------------------------------------------------------

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE COMMENT 'User email (optional)',
  username VARCHAR(100) UNIQUE NOT NULL COMMENT 'Login username (required)',
  password_hash VARCHAR(255) NOT NULL COMMENT 'Bcrypt hashed password',
  full_name VARCHAR(255) COMMENT 'User display name',
  avatar_url TEXT COMMENT 'Profile picture URL',
  is_premium TINYINT(1) DEFAULT 0 COMMENT '1 = premium user, 0 = free user',
  subscription_expires_at DATETIME NULL,
  subscription_plan_id SMALLINT NULL
  email_verification_token VARCHAR(255) NULL COMMENT 'UUID token untuk verifikasi email',
  email_verified TINYINT(1) DEFAULT 0 COMMENT '0 = belum verifikasi, 1 = sudah verifikasi',
  email_verified_at DATETIME NULL COMMENT 'Waktu berhasil verifikasi',
  email_verification_token_expires_at DATETIME NULL COMMENT 'Token kadaluarsa 24 jam setelah register',
  email_verification_sent_at DATETIME NULL COMMENT 'Last time verification email was sent',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME COMMENT 'Soft delete timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='User accounts';


-- ----------------------------------------------------------------------------
-- TABLE: genres
-- ----------------------------------------------------------------------------

CREATE TABLE genres (
  id SMALLINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL COMMENT 'Genre name: Action, Drama, etc',
  slug VARCHAR(100) UNIQUE NOT NULL COMMENT 'URL slug: action, drama',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Genre master data';

-- ----------------------------------------------------------------------------
-- TABLE: contents
-- ----------------------------------------------------------------------------

CREATE TABLE contents (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  content_type VARCHAR(20) NOT NULL COMMENT 'movie or series',
  title VARCHAR(255) NOT NULL COMMENT 'Film/series title',
  slug VARCHAR(255) UNIQUE COMMENT 'URL-friendly slug',
  description TEXT COMMENT 'Synopsis',
  release_year SMALLINT COMMENT 'Release year',
  age_rating VARCHAR(5) COMMENT '13+, 17+, 21+',
  total_episodes SMALLINT COMMENT 'For series only',
  duration_minutes SMALLINT COMMENT 'For movies only',
  youtube_id VARCHAR(100) COMMENT 'YouTube video ID for trailer',
  poster_url TEXT COMMENT 'Portrait poster image',
  banner_url TEXT COMMENT 'Landscape banner image',
  video_url TEXT COMMENT 'Full video URL',
  cast TEXT COMMENT 'Comma-separated cast names',
  creator VARCHAR(255) COMMENT 'Director/creator name',
  rating DECIMAL(3,1) COMMENT 'User rating 0.0-5.0',
  is_premium_only TINYINT(1) DEFAULT 0 COMMENT 'Requires subscription',
  top_rank INT DEFAULT NULL COMMENT 'Content ranking position',
  is_new_release TINYINT(1) DEFAULT 0 COMMENT '1 = newly released',
  has_new_episode TINYINT(1) DEFAULT 0 COMMENT '1 = has new episode',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME COMMENT 'Soft delete'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Movies and TV series';

-- ----------------------------------------------------------------------------
-- TABLE: episodes
-- ----------------------------------------------------------------------------

CREATE TABLE episodes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  content_id BIGINT NOT NULL COMMENT 'FK to contents table',
  episode_number SMALLINT NOT NULL COMMENT 'Episode number within series',
  title VARCHAR(255) COMMENT 'Episode title',
  description TEXT COMMENT 'Episode synopsis',
  duration_minutes SMALLINT COMMENT 'Episode duration',
  youtube_id VARCHAR(100) COMMENT 'YouTube video ID',
  video_url TEXT COMMENT 'Full episode video URL',
  thumbnail_url TEXT COMMENT 'Episode thumbnail',
  release_date DATE COMMENT 'Episode release date',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE,
  UNIQUE KEY uk_episodes_content_episode (content_id, episode_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='TV series episodes';

-- ----------------------------------------------------------------------------
-- TABLE: content_genres (Junction)
-- ----------------------------------------------------------------------------

CREATE TABLE content_genres (
  content_id BIGINT NOT NULL COMMENT 'FK to contents',
  genre_id SMALLINT NOT NULL COMMENT 'FK to genres',
  PRIMARY KEY (content_id, genre_id),
  FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Content-Genre many-to-many junction';

-- ----------------------------------------------------------------------------
-- TABLE: favorites
-- ----------------------------------------------------------------------------

CREATE TABLE favorites (
  user_id BIGINT NOT NULL COMMENT 'FK to users',
  content_id BIGINT NOT NULL COMMENT 'FK to contents',
  notes TEXT COMMENT 'User notes on this favorite',
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, content_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='User favorites/watchlist';

-- ----------------------------------------------------------------------------
-- TABLE: watch_history (with rating/note/status columns included)
-- ----------------------------------------------------------------------------

CREATE TABLE watch_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL COMMENT 'FK to users',
  content_id BIGINT NOT NULL COMMENT 'FK to contents',
  episode_id BIGINT COMMENT 'FK to episodes (NULL for movies)',
  rating TINYINT UNSIGNED COMMENT 'User rating 1-10',
  note TEXT COMMENT 'User notes',
  status ENUM('watching', 'completed', 'on_hold') DEFAULT 'watching',
  progress_seconds INT NOT NULL DEFAULT 0 COMMENT 'Current playback position',
  duration_seconds INT NOT NULL COMMENT 'Total video duration',
  completed TINYINT(1) DEFAULT 0 COMMENT '1 = finished watching',
  last_watched_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE,
  FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE,
  UNIQUE KEY uk_watch_history_user_content_episode (user_id, content_id, episode_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='User viewing history and progress';

-- ----------------------------------------------------------------------------
-- TABLE: orders
-- ----------------------------------------------------------------------------

CREATE TABLE orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL COMMENT 'FK to users',
  plan_id SMALLINT NOT NULL COMMENT 'FK to subscription_plans',
  order_code VARCHAR(50) UNIQUE NOT NULL COMMENT 'Public order identifier (UUID)',
  amount DECIMAL(12,2) NOT NULL COMMENT 'Order total in IDR',
  status ENUM('pending','paid','active','expired','cancelled','failed') DEFAULT 'pending',
  expired_at DATETIME COMMENT 'Order expiration (24h from creation)',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Subscription orders';

-- ----------------------------------------------------------------------------
-- TABLE: payments
-- ----------------------------------------------------------------------------

CREATE TABLE payments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL COMMENT 'FK to orders',
  payment_method VARCHAR(50) COMMENT 'bca, mandiri, card, etc',
  transaction_id VARCHAR(255) COMMENT 'Internal transaction ID',
  amount DECIMAL(12,2) NOT NULL COMMENT 'Payment amount',
  status ENUM('pending','succeeded','failed','cancelled','expired') DEFAULT 'pending',
  transaction_status VARCHAR(50) COMMENT 'Raw status from gateway',
  payment_provider VARCHAR(50) COMMENT 'midtrans, xendit, etc',
  external_payment_id VARCHAR(255) UNIQUE COMMENT 'Payment gateway ID',
  payment_url TEXT COMMENT 'Payment page URL',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  paid_at DATETIME COMMENT 'Payment success timestamp',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  expired_at DATETIME COMMENT 'Payment link expiration',
  retry_count SMALLINT DEFAULT 0 COMMENT 'Number of retry attempts',
  last_retry_at DATETIME COMMENT 'Last retry timestamp',
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Payment transactions';

-- ----------------------------------------------------------------------------
-- TABLE: content_recommendations
-- ----------------------------------------------------------------------------

CREATE TABLE content_recommendations (
  content_id BIGINT NOT NULL COMMENT 'Source content',
  recommended_content_id BIGINT NOT NULL COMMENT 'Recommended content',
  order_position SMALLINT DEFAULT 0 COMMENT 'Display order',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (content_id, recommended_content_id),
  FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE,
  FOREIGN KEY (recommended_content_id) REFERENCES contents(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Content recommendations';

-- ============================================================================
-- STEP 3: CREATE INDEXES
-- ============================================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_premium ON users(is_premium);
CREATE INDEX idx_users_verification_token ON users(email_verification_token);

-- Contents indexes
CREATE INDEX idx_contents_type ON contents(content_type);
CREATE INDEX idx_contents_slug ON contents(slug);
CREATE INDEX idx_contents_premium ON contents(is_premium_only);
CREATE INDEX idx_contents_year ON contents(release_year);

-- Episodes indexes
CREATE INDEX idx_episodes_content ON episodes(content_id);
CREATE INDEX idx_episodes_number ON episodes(episode_number);

-- Favorites indexes
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_content ON favorites(content_id);

-- Watch history indexes
CREATE INDEX idx_watch_history_user ON watch_history(user_id);
CREATE INDEX idx_watch_history_content ON watch_history(content_id);
CREATE INDEX idx_watch_history_completed ON watch_history(completed);
CREATE INDEX idx_watch_history_status ON watch_history(status);

-- Orders indexes
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_code ON orders(order_code);

-- Payments indexes
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_external ON payments(external_payment_id);
