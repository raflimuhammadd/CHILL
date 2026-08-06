const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
    async register ({username, password}) {
        const normalizedUsername = this.normalizedUsername(username);
        const validatedPassword = validatedPassword(password);
        const [rows] = await db.query(
            'SELECT * FROM users WHERE username = ?', [username.trim()]
        );

        if (!username || !username.trim()) throw new Error('Username is required');
        if (normalizedUsername.length < 3 || normalizedUsername.length > 20) {
            throw new Error ('Username must be between 3 and 20 characters');
        }

        if (!/^[a-zA-Z0-9_]+$/.test(normalizedUsername)) {
            throw new Error ('Username must only contain letters, numbers, and underscores');
        }

        if (!normalizedPassword) throw new Error ('Password is required');
        if (normalizedPassword.length < 6) throw new Error ('Password must be at least 6 characters long');

        const existing = await this._findByUsername(normalizedUsername);
        if (existing) throw new Error ('Username has already been taken');
        const hashedPassword = await bcrypt.hash(normalizedPassword, 10);

        const [result] = await db.query(
            'INSERT INTO users (username, password_hash) VALUES (?, ?)',
            [normalizedUsername, hashedPassword]
        );
        return this._sanitize(await this.getUserById(result.insertId));
    }

    async login ({username, password}) {
        if (!username || !password) throw new Error ('Username and password are required');

        const [rows] = await db.query(
            'SELECT * FROM users WHERE username = ? AND deleted_at IS NULL',
            [username.trim()]
        );
        const user = rows[0];
        if (!user) throw new Error ('Invalid username or password');

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) throw new Error ('Invalid username or password');

        return {
            accessToken: this.generateToken(user),
            user: this._sanitize(user),
        };
    }

    async getUserById(id) {
        const [rows] = await db.query(
            `SELECT id, email, username, full_name, avatar_url, is_premium, created_at
            FROM users WHERE id = ? AND deleted_at IS NULL`,
            [id]
        );
        return rows[0];
    }

    generateToken(user) {
        return jwt.sign(
            {id: user.id, username: user.username},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN || '7d'}
        );
    }

    async _findByUsername(username) {
        const [rows] = await db.query(
            'SELECT id, username FROM users WHERE username = ?',
            [username]
        );
        return rows[0];
    }

    _sanitize(user) {
        if (!user) return null;
        const {password_hash, ...safeUser} = user;
        return safeUser;
    }
}

module.exports = new AuthService();