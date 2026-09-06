const db = require('../../config/database');

class UserRepository {
    async findByUsername(username) {
        try {
            const [rows] = await db.query(
                `SELECT id, username
                FROM users
                WHERE username = ?`,
                [username]
            );
            return rows[0];
        } catch (error) {
            console.error('Error finding user by username:', error);
            throw new Error('Failed to find user by username');
        }
    }

    async findByEmail(email) {
    try {
      if (!email) return null;
      
      const [rows] = await db.query(
        'SELECT id, email FROM users WHERE email = ?',
        [email]
      );
      return rows[0];
    } catch (error) {
      console.error('[UserRepository] Error in findByEmail:', error);
      throw new Error('Failed to find user by email');
    }
  }

  async findByVerificationToken(token) {
    try {
      const [rows] = await db.query(
        `SELECT id, email_verified, email_verification_token_expires_at 
         FROM users 
         WHERE email_verification_token = ? AND deleted_at IS NULL`,
        [token]
      );
      return rows[0];
    } catch (error) {
      console.error('[UserRepository] Error in findByVerificationToken:', error);
      throw new Error('Failed to find user by verification token');
    }
  }

  async getUserById(id) {
    try {
      const [rows] = await db.query(
        `SELECT id, email, username, full_name, avatar_url, is_premium, 
                email_verified, email_verification_sent_at, created_at 
         FROM users 
         WHERE id = ? AND deleted_at IS NULL`,
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('[UserRepository] Error in getUserById:', error);
      throw new Error('Failed to get user by ID');
    }
  }

  async findByUsernameForAuth(username) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM users WHERE username = ? AND deleted_at IS NULL',
        [username]
      );
      return rows[0];
    } catch (error) {
      console.error('[UserRepository] Error in findByUsernameForAuth:', error);
      throw new Error('Failed to find user for authentication');
    }
  }

  async createUser(userData) {
    try {
      const {
        username,
        password_hash,
        email,
        email_verification_token,
        email_verification_token_expires_at
      } = userData;

      const [result] = await db.query(
        `INSERT INTO users 
         (username, password_hash, email, email_verification_token, 
          email_verified, email_verification_token_expires_at) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          username,
          password_hash,
          email,
          email_verification_token,
          0, // email_verified default false
          email_verification_token_expires_at
        ]
      );
      return result.insertId;
    } catch (error) {
      console.error('[UserRepository] Error in createUser:', error);
      throw new Error('Failed to create user');
    }
  }

  async updateEmailVerification(userId) {
    try {
      const [result] = await db.query(
        `UPDATE users 
         SET email_verified = 1, 
             email_verified_at = NOW(), 
             email_verification_token = NULL,
             email_verification_token_expires_at = NULL
         WHERE id = ?`,
        [userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('[UserRepository] Error in updateEmailVerification:', error);
      throw new Error('Failed to update email verification');
    }
  }

  async updateVerificationToken(userId, token, expiresAt) {
    try {
      const [result] = await db.query(
        `UPDATE users
         SET email_verification_token = ?,
             email_verification_token_expires_at = ?,
             email_verification_sent_at = NOW()
         WHERE id = ?`,
        [token, expiresAt, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('[UserRepository] Error in updateVerificationToken:', error);
      throw new Error('Failed to update verification token');
    }
  }

    async incrementTokenVersion(userId) {
    try {
      const [result] = await db.query(
        'UPDATE users SET refresh_token_version = refresh_token_version + 1 WHERE id = ?',
        [userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('[UserRepository] Error in incrementTokenVersion:', error);
      throw new Error('Failed to increment token version');
    }
  }

    async getUserFavorites(userId) {
    try {
      const [rows] = await db.query(
        `SELECT f.content_id, f.notes, f.added_at,
                c.title, c.slug, c.content_type, c.poster_url, 
                c.banner_url, c.rating, c.release_year, c.age_rating,
                c.is_premium_only
         FROM favorites f
         INNER JOIN contents c ON f.content_id = c.id
         WHERE f.user_id = ?
         ORDER BY f.added_at DESC`,
        [userId]
      );
      return rows;
    } catch (error) {
      console.error('[UserRepository] Error in getUserFavorites:', error);
      throw new Error('Failed to get user favorites');
    }
  }
}

module.exports = new UserRepository();