-- ============================================================================
-- SEED MASTER DATA
-- Description: Reference data needed for application to function
-- Requires: Tables created via 01_create_tables.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Genres (15 common genres)
-- ----------------------------------------------------------------------------

INSERT INTO genres (name, slug) VALUES 
  ('Action', 'action'),
  ('Drama', 'drama'),
  ('Comedy', 'comedy'),
  ('Thriller', 'thriller'),
  ('Horror', 'horror'),
  ('Sci-Fi', 'sci-fi'),
  ('Romance', 'romance'),
  ('Animation', 'animation'),
  ('Adventure', 'adventure'),
  ('Crime', 'crime'),
  ('Fantasy', 'fantasy'),
  ('Mystery', 'mystery'),
  ('Sports', 'sports'),
  ('Family', 'family'),
  ('Superhero', 'superhero');

-- ----------------------------------------------------------------------------
-- Subscription Plans (3 tiers matching frontend)
-- ----------------------------------------------------------------------------

INSERT INTO subscription_plans (name, slug, description, price, duration_days, quality, is_active) VALUES
  ('Individual', 'individual', 'Perfect untuk 1 orang', 49990.00, 30, '720p', 1),
  ('Berdua', 'duo', 'Berbagi dengan 1 orang lain', 79990.00, 30, '1080p', 1),
  ('Keluarga', 'family', 'Untuk satu keluarga', 159990.00, 30, '4K', 1);

-- ----------------------------------------------------------------------------
-- Test User (password: 'password123' - bcrypt hashed)
-- Hash generated with: bcrypt.hash('password123', 10)
-- ----------------------------------------------------------------------------

INSERT INTO users (email, username, password_hash, full_name, is_premium) VALUES
  ('test@chill.com', 'testuser', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Test User', 0),
  ('premium@chill.com', 'premiumuser', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Premium User', 1);
