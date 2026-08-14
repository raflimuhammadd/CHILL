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

    async login({ username, password }) {
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

        return {
            accessToken: this.generateToken(user),
            user: this._sanitize(user),
        };
    }

    async getUserById(id) {
        const [rows] = await db.query(
            'SELECT id, email, username, full_name, avatar_url, is_premium, email_verified, created_at FROM users WHERE id = ? AND deleted_at IS NULL',
            [id]
        );
        return rows[0];
    }

    generateToken(user) {
        return jwt.sign(
            {
                id: user.id,
                username: user.username,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '7d'
            }
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

    _sanitize(user) {
        if (!user) return null;
        const { password_hash, ...safeUser } = user;
        return safeUser;
    }
}

module.exports = new AuthService();