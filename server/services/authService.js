const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {ValidationError, ConflictError} = require('../utils/error');
const {validateUsername, validatePassword} = require('../utils/validators');

class AuthService {
    async register ({username, password}) {
        const normalizedUsername = validateUsername(username);
        const normalizedPassword = validatedPassword(password);
        
        const existing = await this._findByUsername(normalizedUsername);

        if (existing) {
            throw new ConflictError('Username already in use');
        }

        const hashedPassword = await bcrypt.hash(normalizedPassword, 10);

        const [result] = await db.query(
            'INSERT INTO users (username, password_hash) VALUES (?, ?)',
            [normalizedUsername, hashedPassword]
        );

        return this._sanitize(await this.getUserById(result.insertId));
    }

    async login ({username, password}) {
        if (!username || !password) {
            throw new ValidationError('Username and password are required');
        };

        const [rows] = await db.query(
            'SELECT * FROM users WHERE username = ? AND deleted_at IS NULL',
            [username.trim()]
        );
        const user = rows[0];

        if (!user) {
            throw new ValidationError('Invalid username or password');
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            throw new ValidationError('Invalid username or password');
        }

        return {
            accessToken: this.generateToken(user),
            user: this._sanitize(user),
        };
    }

    async getUserById(id) {
        const [rows] = await db.query(
            'SELECT id, email, username, full_name, avatar_url, is_premium, created_at FROM users WHERE id = ? AND deleted_at IS NULL',
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

    _sanitize(user) {
        if (!user) return null;
        const { password_hash, ...safeUser } = user;
        return safeUser;
    }

}

module.exports = new AuthService();