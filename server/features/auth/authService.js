const userRepository = require('./userRepository');
const refreshTokenRepository = require('./refreshTokenRepository');
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

        const existing = await userRepository.findByUsername(normalizedUsername);

        if (existing) {
            throw new ConflictError('Username already in use');
        }

        if (normalizedEmail) {
            const existingEmail = await userRepository.findByEmail(normalizedEmail);
            if (existingEmail) {
                return null;
            }
        }

        const hashedPassword = await bcrypt.hash(normalizedPassword, 10);
        const verificationToken = uuidv4();
        const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const userId = await userRepository.createUser({
            username: normalizedUsername,
            password_hash: hashedPassword,
            email: normalizedEmail,
            email_verification_token: verificationToken,
            email_verification_token_expires_at: tokenExpiresAt
        });

        if (normalizedEmail) {
            try {
                await emailService.sendVerificationEmail(normalizedEmail, verificationToken);
            } catch (emailError) {
                console.error('[AuthService] Failed to send verification email:', emailError.message);
            }
        }

        return this._sanitize(await this.getUserById(userId));
    }

    async verifyEmail(token) {
        if (!token || typeof token !== 'string' || token.trim() === '') {
            throw new ValidationError('Verification token is required');
        }

        const user = await userRepository.findByVerificationToken(token.trim());

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

        await userRepository.updateEmailVerification(user.id);

        return { 
            verified: true,
            alreadyVerified: false,
            message: 'Email Verified Successfully' 
        };
    }

    async resendVerification(userId) {
        const user = await userRepository.getUserById(userId);

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

        await userRepository.updateVerificationToken(userId, verificationToken, tokenExpiresAt);

        await emailService.sendVerificationEmail(user.email, verificationToken);

        return {message: 'Verification email sent'};
    }

    async login({ username, password }, ipAddress, userAgent) {
        if (!username || !password) {
            throw new ValidationError('Username and password are required');
        }

        const user = await userRepository.findByUsernameForAuth(username.trim());

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
        const user = await userRepository.getUserById(id);
        return user;
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

        await refreshTokenRepository.storeRefreshToken({
            userId,
            token: refreshToken,
            tokenVersion,
            expiresAt,
            ipAddress,
            userAgent
        });
        
        return expiresAt;
    }

    async cleanupExpiredTokens(userId) {
        await refreshTokenRepository.deleteExpiredTokens(userId);
    }

    async verifyRefreshToken(refreshToken) {
        if (!refreshToken) {
            throw new AuthError('Refresh token required');
        }

        const tokenRecord = await refreshTokenRepository.findRefreshToken(refreshToken);

        if (!tokenRecord) {
            throw new AuthError('Invalid refresh token');
        }

        if (new Date(tokenRecord.expires_at) < new Date()) {
            await refreshTokenRepository.deleteTokenById(tokenRecord.id);
            throw new AuthError('Refresh token expired');
        }

        if (tokenRecord.token_version !== tokenRecord.refresh_token_version) {
            throw new AuthError('Refresh token revoked');
        }

        await refreshTokenRepository.updateLastUsed(tokenRecord.id);

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
        await userRepository.incrementTokenVersion(userId);
        await refreshTokenRepository.deleteAllUserTokens(userId);

        return {
            message: 'Logged out successfully'
        };
    }

    async _getFavorites(userId) {
        const rows = await userRepository.getUserFavorites(userId);
        return rows;
    }

    _sanitize(user) {
        if (!user) return null;
        const { password_hash, ...safeUser } = user;
        return safeUser;
    }
}

module.exports = new AuthService();