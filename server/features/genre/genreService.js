const genreRepository = require('./genreRepository');
const {ValidationError, ConflictError, NotFoundError} = require('../../utils/error');
const {MESSAGES} = require('../../utils/constant');

class GenreService {
    async getAllGenres() {
        try {
            const rows = await genreRepository.getAllGenres();
            return rows;
        } catch (error) {
            console.error('[GenreService] Error in getAllGenres:', error);
            throw new Error('Failed to fetch genres');
        }
    }

    async getGenreById(id) {
        try {
            const genre = await genreRepository.getGenreById(id);
            return genre;
        } catch (error) {
            console.error('[GenreService] Error in getGenreById:', error);
            throw new Error('Failed to fetch genre by ID');
        }
    }

    async createGenre(data) {
        try {
            const {name} = data;

            if (!name || name.trim() === '') {
                throw new ValidationError(MESSAGES.GENRE_NAME_REQUIRED);
            }
            const slug = data.slug || this._generateSlug(name);
            const isDuplicate = await genreRepository.checkDuplicateSlug(slug);

            if (isDuplicate) {
                throw new ConflictError(`Slug '${slug}' already exists`);
            }
            const insertId = await genreRepository.createGenre(name.trim(), slug);
            return await this.getGenreById(insertId);
        } catch (error) {
            console.error('[GenreService] Error in createGenre:', error);
            throw error;
        }
    }

    async updateGenre(id, data) {
        try {
            const existing = await this.getGenreById(id);
            if (!existing) {
                throw new NotFoundError('Genre not found');
            }

            if (!data.name && !data.slug) {
                throw new ValidationError('At least one of name or slug must be provided for update');
            }

            const name = data.name ? data.name.trim() : existing.name;
            const slug = data.slug ? data.slug.trim() : (data.name ? this._generateSlug(name) : existing.slug);

            if (slug !== existing.slug) {
                const isDuplicate = await genreRepository.checkDuplicateSlug(slug, id);
                if (isDuplicate) {
                    throw new ConflictError(`Slug '${slug}' already exists`);
                }
            }

            const update = await genreRepository.updateGenre(id, name, slug);
            if (!update) {
                throw new Error('Failed to update genre');
            }
            return await this.getGenreById(id);
        } catch (error) {
            console.log('Error in updateGenre', error);
            throw error;
        }
    }

    async deleteGenre(id) {
        try {
            const existing = await this.getGenreById(id);
            if (!existing) {
                throw new NotFoundError('Genre not found');
            }

            const deleted = await genreRepository.deleteGenre(id);
            if (!deleted) {
                throw new Error('Failed to delete genre');
            }

            return {message: 'Genre deleted successfully'};
        } catch (error) {
            console.error('[GenreService] Error in deleteGenre:', error);
            throw error;
        }
    }

    _generateSlug(name) {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')
    }
}

module.exports = new GenreService();