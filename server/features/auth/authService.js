const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { 
    ValidationError, 
    ConflictError, 
    AuthError,
    NotFoundError,
    RateLimitError,
} = require('../../utils/error');
const { 
    validateUsername, 
    validatePassword, 
    validateEmail 
} = require('../../utils/validators');
const {RATE_LIMIT} = require('../../utils/constant');
const emailService = require('../email/emailService');

class AuthService {
    async register({ username, password, email }) {
        const normalizedUsername = validateUsername(username);
        const normalizedPassword = validatePassword(password);
        const normalizedEmail = validateEmail(email);

        const existing = await this._findByUsername(normalizedUsername);

        if (existing) {
            throw new ConflictError('Username already in use');
        }

        if (normalizedEmail) {
            const existingEmail = await this._findByEmail(normalizedEmail);
            if (existingEmail) {
                return null;
            }
        }

        const hashedPassword = await bcrypt.hash(normalizedPassword, 10);
        const verificationToken = uuidv4();
        const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const [result] = await db.query(
            `INSERT INTO users 
             (username, password_hash, email, email_verification_token, email_verified, email_verification_token_expires_at) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                normalizedUsername, 
                hashedPassword, 
                normalizedEmail, 
                verificationToken, 
                0,
                tokenExpiresAt
            ]
        );

        if (normalizedEmail) {
            try {
                await emailService.sendVerificationEmail(normalizedEmail, verificationToken);
            } catch (emailError) {
                console.error('[AuthService] Failed to send verification email:', emailError.message);
            }
        }

        return this._sanitize(await this.getUserById(result.insertId));
    }

    async verifyEmail(token) {
        if (!token || typeof token !== 'string' || token.trim() === '') {
            throw new ValidationError('Verification token is required');
        }

        const [rows] = await db.query(
            `SELECT id, email_verified, email_verification_token_expires_at 
             FROM users 
             WHERE email_verification_token = ? AND deleted_at IS NULL`,
            [token.trim()]
        );

        const user = rows[0];

        if (!user) {
            throw new AuthError('Invalid Verification Token');
        }

        if (user.email_verified === 1) {
            return { 
                verified: true, 
                alreadyVerified: true,
                message: 'Email already verified' 
            };
        }

        const now = new Date();
        const expiresAt = new Date(user.email_verification_token_expires_at);

        if (expiresAt < now) {
            throw new AuthError('Verification token has expired');
        }

        await db.query(
            `UPDATE users 
             SET email_verified = 1, 
                 email_verified_at = NOW(), 
                 email_verification_token = NULL,
                 email_verification_token_expires_at = NULL
             WHERE id = ?`,
            [user.id]
        );

        return { 
            verified: true,
            alreadyVerified: false,
            message: 'Email Verified Successfully' 
        };
    }

    async resendVerification(userId) {
        const [rows] = await db.query(
            'SELECT id, email, email_verified, email_verification_sent_at FROM users WHERE id = ? AND deleted_at IS NULL',
            [userId]
        );
        const user = rows[0];

        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (!user.email) {
            throw new ValidationError('Email is required');
        }

        if (user.email_verified === 1) {
            return {message: 'Email already verified'};
        }

        if (user.email_verification_sent_at) {
            const lastSent = new Date(user.email_verification_sent_at);
            const elapsedMs = Date.now() - lastSent.getTime();

            if (elapsedMs < RATE_LIMIT.RESEND_COOLDOWN_MS) {
                const waitSeconds = Math.ceil((RATE_LIMIT.RESEND_COOLDOWN_MS - elapsedMs) / 1000);
                throw new RateLimitError(`Please wait ${waitSeconds} seconds before resending verification email`);
            }
        }

        const verificationToken = uuidv4();
        const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await db.query(
            `UPDATE users
            SET email_verification_token = ?,
            email_verification_token_expires_at = ?,
            email_verification_sent_at = NOW()
            WHERE id = ?`,
            [verificationToken, tokenExpiresAt, userId]
        );

        await emailService.sendVerificationEmail(user.email, verificationToken);

        return {message: 'Verification email sent'};
    }

    async login({ username, password }, ipAddress, userAgent) {
        if (!username || !password) {
            throw new ValidationError('Username and password are required');
        }

        const [rows] = await db.query(
            'SELECT * FROM users WHERE username = ? AND deleted_at IS NULL',
            [username.trim()]
        );
        const user = rows[0];

        if (!user) {
            throw new AuthError('Invalid username or password');
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            throw new AuthError('Invalid username or password');
        }

        await this.cleanupExpiredTokens(user.id);

        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken();
        
        await this.storeRefreshToken(
            user.id, refreshToken, user.refresh_token_version, ipAddress, userAgent
        );

        const sanitizedUser = this._sanitize(user);
        const favorites = await this._getFavorites(user.id);

        return {
            accessToken,
            refreshToken,
            user: {...sanitizedUser, favorites},
        };
    }

    async getUserById(id) {
        const [rows] = await db.query(
            'SELECT id, email, username, full_name, avatar_url, is_premium, email_verified, created_at FROM users WHERE id = ? AND deleted_at IS NULL',
            [id]
        );
        return rows[0];
    }

    generateAccessToken(user) {
        return jwt.sign(
            {
                id: user.id,
                username: user.username,
                tokenVersion: user.refresh_token_version,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '15m'
            }
        );
    }

    generateRefreshToken() {
        return require('uuid').v4();
    }

    async storeRefreshToken(userId, refreshToken, tokenVersion, ipAddress, userAgent) {
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        await db.query(
            `INSERT INTO refresh_tokens
            (user_id, token, token_version, expires_at, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, refreshToken, tokenVersion, expiresAt, ipAddress, userAgent]
        );
        return expiresAt;
    }

    async cleanupExpiredTokens(userId) {
        await db.query(
            'DELETE FROM refresh_tokens WHERE user_id = ? AND expires_at < NOW()',
            [userId]
        );
    }

    async _findByUsername(username) {
        const [rows] = await db.query(
            'SELECT id, username FROM users WHERE username = ?',
            [username]
        );
        return rows[0];
    }

    async _findByEmail(email) {
        if (!email) return null;
        const [rows] = await db.query(
            'SELECT id, email FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    async verifyRefreshToken(refreshToken) {
        if (!refreshToken) {
            throw new AuthError('Refresh token required');
        }

        const [rows] = await db.query(
            `SELECT rt.*, u.refresh_token_version, u.username
            FROM refresh_tokens rt
            INNER JOIN users u ON rt.user_id = u.id
            WHERE rt.token = ? AND u.deleted_at IS NULL`,
            [refreshToken]
        );

        const tokenRecord = rows[0];

        if (!tokenRecord) {
            throw new AuthError('Invalid refresh token');
        }

        if (new Date(tokenRecord.expires_at) < new Date()) {
            await db.query('DELETE FROM refresh_tokens WHERE id = ?',
                [tokenRecord.id]
            );
            throw new AuthError('Refresh token expired');
        }

        if (tokenRecord.token_version !== tokenRecord.refresh_token_version) {
            throw new AuthError('Refresh token revoked');
        }

        await db.query(
            'UPDATE refresh_tokens SET last_used_at = NOW() WHERE id = ?',
            [tokenRecord.id]
        );

        return {
            id: tokenRecord.user_id,
            username: tokenRecord.username,
            refresh_token_version: tokenRecord.refresh_token_version,
        };
    }

    async refreshAccessToken(refreshToken) {
        const user = await this.verifyRefreshToken(refreshToken);
        return this.generateAccessToken(user);
    }

    async logout(userId) {
        await db.query(
            'UPDATE users SET refresh_token_version = refresh_token_version + 1 WHERE id = ?',
            [userId]
        );

        await db.query('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);

        return {
            message: 'Logged out successfully'
        };
    }

    async _getFavorites(userId) {
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
}

    _sanitize(user) {
        if (!user) return null;
        const { password_hash, ...safeUser } = user;
        return safeUser;
    }
}

module.exports = new AuthService();