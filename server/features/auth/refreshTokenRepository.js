const db = require('../../config/database');

class RefreshTokenRepository {
      async storeRefreshToken(tokenData) {
    try {
      const { userId, token, tokenVersion, expiresAt, ipAddress, userAgent } = tokenData;

      const [result] = await db.query(
        `INSERT INTO refresh_tokens
         (user_id, token, token_version, expires_at, ip_address, user_agent)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, token, tokenVersion, expiresAt, ipAddress, userAgent]
      );
      return result.insertId;
    } catch (error) {
      console.error('[RefreshTokenRepository] Error in storeRefreshToken:', error);
      throw new Error('Failed to store refresh token');
    }
  }

  async findRefreshToken(token) {
    try {
      const [rows] = await db.query(
        `SELECT rt.*, u.refresh_token_version, u.username
         FROM refresh_tokens rt
         INNER JOIN users u ON rt.user_id = u.id
         WHERE rt.token = ? AND u.deleted_at IS NULL`,
        [token]
      );
      return rows[0];
    } catch (error) {
      console.error('[RefreshTokenRepository] Error in findRefreshToken:', error);
      throw new Error('Failed to find refresh token');
    }
  }

  async updateLastUsed(tokenId) {
    try {
      const [result] = await db.query(
        'UPDATE refresh_tokens SET last_used_at = NOW() WHERE id = ?',
        [tokenId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('[RefreshTokenRepository] Error in updateLastUsed:', error);
      throw new Error('Failed to update last used timestamp');
    }
  }

  async deleteExpiredTokens(userId) {
    try {
      const [result] = await db.query(
        'DELETE FROM refresh_tokens WHERE user_id = ? AND expires_at < NOW()',
        [userId]
      );
      return result.affectedRows;
    } catch (error) {
      console.error('[RefreshTokenRepository] Error in deleteExpiredTokens:', error);
      throw new Error('Failed to delete expired tokens');
    }
  }

  async deleteTokenById(tokenId) {
    try {
      const [result] = await db.query(
        'DELETE FROM refresh_tokens WHERE id = ?',
        [tokenId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('[RefreshTokenRepository] Error in deleteTokenById:', error);
      throw new Error('Failed to delete token');
    }
  }

    async deleteAllUserTokens(userId) {
    try {
      const [result] = await db.query(
        'DELETE FROM refresh_tokens WHERE user_id = ?',
        [userId]
      );
      return result.affectedRows;
    } catch (error) {
      console.error('[RefreshTokenRepository] Error in deleteAllUserTokens:', error);
      throw new Error('Failed to delete all user tokens');
    }
  }
}

module.exports = new RefreshTokenRepository();