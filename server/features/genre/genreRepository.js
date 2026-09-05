const db = require('../../config/database');

class GenreRepository {
    async getAllGenres() {
        try {
            const [rows] = await db.query(
                `SELECT id, name, slug, created_at
                FROM genres
                ORDER BY id ASC`
            );
        return rows;
        } catch (error) {
            console.error('[GenreRepository] Error in getAllGenres:', error);
            throw new Error('Failed to fetch genres from database');
        }
    }

    async getGenreById(id) {
        try {
            const [rows] = await db.query(
                `SELECT id, name, slug, created_at
                FROM genres
                WHERE id = ?`,
                [id]
            );
            return rows[0];
        } catch (error) {
            console.error('[GenreRepository] Error in getGenreById:', error);
            throw new Error('Failed to fetch genre by ID from database');
        }
    }

    async createGenre(name, slug) {
        try {
            const [result] = await db.query (
                `INSERT INTO genres (name, slug, created_at)
                VALUES (?, ?, NOW())`,
                [name, slug]
            );
            return result.insertId;
        } catch (error) {
            console.error('[GenreRepository] Error in createGenre:', error);
            throw new Error('Failed to create genre in database');
        }
    }

    async updateGenre(id, name, slug) {
        try {
            const [result] = await db.query (
                `UPDATE genres SET name = ?, slug = ?
                WHERE id = ?`,
                [name, slug, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('[GenreRepository] Error in updateGenre:', error);
            throw new Error('Failed to update genre in database');
        }
    }

    async deleteGenre(id) {
        try {
            const [result] = await db.query (
                `DELETE FROM genres
                WHERE id = ?`,
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('[GenreRepository] Error in deleteGenre:', error);
            throw new Error('Failed to delete genre from database');
        }
    }

    async checkDuplicateSlug(slug, excludeId = null) {
        try {
            let sql = 'SELECT id FROM genres WHERE slug = ?';
            const params = [slug];

            if (excludeId) {
                sql += ' AND id != ?';
                params.push(excludeId);
            }

            const [rows] = await db.query(sql, params);
            return rows.length > 0;
        } catch (error) {
            console.error('[GenreRepository] Error in checkDuplicateSlug:', error);
            throw new Error('Failed to check for duplicate slug in database');
        }
    }
}

module.exports = new GenreRepository();