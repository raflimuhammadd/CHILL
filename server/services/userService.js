const db = require('../config/database');
const bcrypt = require('bcryptjs');

class UserService {
    async getProfile(userId) {
        const [rows] = await db.query(
            `SELECT id, email, username, full_name, avatar_url, is_premium, created_at
             FROM users WHERE id = ? AND deleted_at IS NULL`,
            [userId]
        );
        return this._sanitize(rows[0]);
    }


    async updateProfile(userId, data) {
        const existing = await this.getProfile(userId);
        if (!existing) throw new Error('User not found');

        const updateFields = {};
        if (data.full_name !== undefined) updateFields.full_name = data.full_name.trim();
        if (data.avatar !== undefined) updateFields.avatar_url = data.avatar;
        if (data.avatar_url !== undefined) updateFields.avatar_url = data.avatar_url;
        if (data.password !== undefined) {
            if (!data.password.trim()) throw new Error('Password cannot be empty');
            if (data.password.length < 6) throw new Error('Password must be at least 6 characters');
            updateFields.password_hash = await bcrypt.hash(data.password, 10);
        }
        if (data.email !== undefined) {
            const trimmedEmail = data.email.trim();
            updateFields.email = trimmedEmail === '' ? null : trimmedEmail.toLowerCase();
            
            // Cek duplikat email (kecuali email milik user sendiri)
            const existingEmail = await this._findByEmail(updateFields.email);
            if (existingEmail && existingEmail.id !== userId) {
                throw new Error('Email already in use');
            }
        }

        // Build dynamic UPDATE query
        const fields = Object.keys(updateFields);
        if (fields.length === 0) throw new Error('No fields to update');

        const setClause = fields.map(f => `${f} = ?`).join(', ');
        const values = [...fields.map(f => updateFields[f]), userId];

        await db.query(`UPDATE users SET ${setClause} WHERE id = ?`, values);

        return this.getProfile(userId);
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