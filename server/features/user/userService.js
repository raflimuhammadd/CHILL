const bcrypt = require('bcryptjs');
const db = require('../../config/database');
const { v4: uuidv4 } = require('uuid');
const { NotFoundError, ConflictError, ValidationError } = require('../../utils/error');
const { MESSAGES } = require('../../utils/constant');
const { validateEmail } = require('../../utils/validators');
const emailService = require('../email/emailService');

class UserService {
// GANTI INI:
async getProfile(userId) {
    const [rows] = await db.query(
        `SELECT u.id, u.email, u.username, u.full_name, u.avatar_url, 
            u.is_premium, u.email_verified, u.created_at, 
            u.subscription_expires_at,
            pl.slug AS subscription_plan
        FROM users u 
        LEFT JOIN subscription_plans pl ON pl.id = u.subscription_plan_id
        WHERE u.id = ? AND u.deleted_at IS NULL`,
        [userId]
    );
    const user = rows[0];
    if (!user) throw new NotFoundError(MESSAGES.USER_NOT_FOUND);

    if (user.subscription_expires_at && new Date(user.subscription_expires_at) < new Date()) {
        await db.query('UPDATE users SET is_premium = 0 WHERE id = ?', [userId]);
        user.is_premium = 0;
    }
    return this._sanitize(user);
}

// DENGAN INI:
    async getProfile(userId) {
        const [rows] = await db.query(
            `SELECT u.id, u.email, u.username, u.full_name, u.avatar_url, 
                u.is_premium, u.email_verified, u.created_at, 
                u.subscription_expires_at,
                pl.slug AS subscription_plan
            FROM users u 
            LEFT JOIN subscription_plans pl ON pl.id = u.subscription_plan_id
            WHERE u.id = ? AND u.deleted_at IS NULL`,
            [userId]
        );
        const user = rows[0];
        if (!user) throw new NotFoundError(MESSAGES.USER_NOT_FOUND);

        if (user.subscription_expires_at && new Date(user.subscription_expires_at) < new Date()) {
            await db.query('UPDATE users SET is_premium = 0 WHERE id = ?', [userId]);
            user.is_premium = 0;
        }
        
        const favorites = await this.getFavorites(userId);
        
        return { ...this._sanitize(user), favorites };
    }

    async updateProfile(userId, data) {
        const existing = await this.getProfile(userId);
        if (!existing) {
            throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
        }

        const updateFields = {};
        
        if (data.full_name !== undefined) {
            updateFields.full_name = data.full_name.trim();
        }
        
        if (data.avatar !== undefined) {
            updateFields.avatar_url = data.avatar;
        }
        
        if (data.avatar_url !== undefined) {
            updateFields.avatar_url = data.avatar_url;
        }
        
        if (data.password !== undefined) {
            if (!data.password.trim()) {
                throw new ValidationError(MESSAGES.PASSWORD_REQUIRED);
            }
            if (data.password.length < 6) {
                throw new ValidationError(MESSAGES.PASSWORD_LENGTH);
            }
            updateFields.password_hash = await bcrypt.hash(data.password, 10);
        }
        
        let newEmail = null;
        let verificationToken = null;

        if (data.email !== undefined) {
            const validEmail = validateEmail(data.email);
            if (validEmail) {
                const existingEmail = await this._findByEmail(validEmail);
                if (existingEmail && existingEmail.id !== userId) {
                    throw new ConflictError(MESSAGES.EMAIL_IN_USE);
                }
                if (existing.email !== validEmail) {
                    verificationToken = uuidv4();
                    newEmail = validEmail;
                    updateFields.email = validEmail;
                    updateFields.email_verified = 0;
                    updateFields.email_verification_token = verificationToken;
                    updateFields.email_verification_token_expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);
                }
            }
        }

        const fields = Object.keys(updateFields);
        if (fields.length === 0) {
            throw new ValidationError('No fields to update');
        }

        const setClause = fields.map(f => `${f} = ?`).join(', ');
        const values = [...fields.map(f => updateFields[f]), userId];

        await db.query(`UPDATE users SET ${setClause} WHERE id = ?`, values);

        // sent new email verification
        if (newEmail && verificationToken) {
            try {
                await emailService.sendVerificationEmail(newEmail, verificationToken);
            } catch (emailError) {
                console.error('[UserService] Failed to sexnd verification email:', emailError.message);
            }
        }

        return this.getProfile(userId);
    }

    async getFavorite(userId) {
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

    async removeFavorite(userId, contentId) {
        const [result] = await db.query(
            `DELETE FROM favorites WHERE user_id = ? AND content_id = ?`,
            [userId, contentId]
        );

        if (result.affectedRows === 0) {
            throw new NotFoundError('Favorite not found');
        }
        
        return {
            success: true
        };
    }

    _sanitize(user) {
        if (!user) return null;
        const { password_hash, ...safeUser } = user;
        return safeUser;
    }

    async _findByEmail(email) {
        if (!email) return null;
        const [rows] = await db.query(
            'SELECT id, email FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }
}

module.exports = new UserService();