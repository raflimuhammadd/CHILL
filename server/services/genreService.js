const db = require('../config/database');

class GenreService {
    async getAllGenres() {
        try {
            const [rows] = await db.query(
                'SELECT id, name, slug, created_at FROM genres ORDER BY id ASC'
            );
            return rows;
        } catch (error) {
            console.log('Error in getAllGenres:', error);
            throw new Error('Failed to fetch genres from DB');
        }
    }

    async getGenreById(id) {
        try {
            const [rows] = await db.query(
                'SELECT id, name, slug, created_at FROM genres WHERE id = ?', [id]
            );
            return rows[0];
        } catch (error) {
            console.log('Error in getGenreById:', error);
            throw new Error('Failed to fetch genre from DB');
        }
    }

    async createGenre(data) {
        try {
            const {name} = data;

            if (!name || name.trim() === '') {
                throw new Error('Genre name is required');
            }

            const slug = data.slug || this._generateSlug(name);

            const isDuplicate = await this._checkDuplicateSlug(slug);
            if (isDuplicate) {
                throw new Error (`Slug '${slug}' already exists`);
            }
            const [result] = await db.query(
                'INSERT INTO genres (name, slug, created_at) VALUES (?, ?, NOW())', [name.trim(), slug]
            );
            return await this.getGenreById(result.insertId);
        } catch (error) {
            console.log('Error in createGenre:', error);
            throw error;
        }
    }

    async updateGenre(id, data) {
        try {
            const existing = await this.getGenreById(id);
            if (!existing) {
                throw new Error('Genre not found');
            }

            if (!data.name && !data.slug) {
                throw new Error('At least one field (name or slug) must be provided');
            }

            const name = data.name ? data.name.trim() : existing.name;
            const slug = data.slug ? data.slug.trim() : (data.name ? this._generateSlug(name) : existing.slug);

            if (slug !== existing.slug) {
                const isDuplicate = await this._checkDuplicateSlug(slug, id);
                if (isDuplicate) {
                    throw new Error (`Slug '${slug}' already exists`);
                }
            }

            await db.query(
                'UPDATE genres SET name = ?, slug = ? WHERE id = ?', [name, slug, id]
            );
            return await this.getGenreById(id);
        } catch (error) {
            console.log('Error in updateGenre:', error);
            throw error;
        }
    }

    async deleteGenre(id) {
        try {
            const existing = await this.getGenreById(id);
            if (!existing) {
                throw new Error('Genre not found');
            }

            await db.query(
                'DELETE FROM genres WHERE id = ?', [id]
            );
            return {message: 'Genre deleted successfully'};
        } catch (error) {
            console.log('Error in deleteGenre:', error);
            throw error;
        }
    }

    /**
     * 
     * Helper generate slug from name
     * converts = "Actions Movies" -> "action-movies"
     */
    _generateSlug(name) {
        return name
            .toLowerCase()
            .trim() // remove leading/trailing spaces
            .replace(/[^\w\s-]/g, '') // remove special chars
            .replace(/[\s_]+/g, '-')   // replace spaces and underscores with hyphens
            .replace(/-+/g, '-')       // replace multiple hyphens with single one
            .replace(/^-+|-+$/g, '');   // remove leading/trailing hyphens
    }

    /**
     * 
     * Helper check duplicate slug
     */
    async _checkDuplicateSlug(slug, excludeId = null) {
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
            console.log('Error in _checkDuplicateSlug:', error);
            throw new Error ('Failed to check duplicate slug');
        }
    }
}

module.exports = new GenreService();