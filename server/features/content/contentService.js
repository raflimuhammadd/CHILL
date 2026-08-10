const db = require('../config/database');
const {ValidationError, NotFoundError} = require('../../utils/error');
const { MESSAGES } = require('../../utils/constant');
const {validateId} = require('../../utils/validators');

class ContentService {
     _mapContent(row) {
        return {
            id: row.id,
            slug: row.slug,
            type: row.content_type,
            title: row.title,
            description: row.description,
            releaseYear: row.release_year,
            ageRating: row.age_rating,
            totalEpisodes: row.total_episodes,
            durationMinutes: row.duration_minutes,
            youtubeId: row.youtube_id,
            posterUrl: row.poster_url,
            bannerUrl: row.banner_url,
            cast: row.cast ? row.cast.split(', ').filter(Boolean) : [],
            creator: row.creator,
            rating: row.rating,
            isPremium: Boolean(row.is_premium_only),
            genres: row.genres ? row.genres.split(', ').filter(Boolean) : [],
            createdAt: row.created_at,
        };
     }

        async getAllContents(filters = {}) {
        const {type, genre, year, premium, sort, limit = 20, offset = 0, page} = filters;
        
        const conditions = [];
        const params = [];

        if (type === 'movie' || type === 'series') {
            conditions.push('c.content_type = ?');
            params.push(type);
        }

        if (year) {
            conditions.push('c.release_year = ?');
            params.push(year);
        }

        if (premium === 'true' || premium === '1') {
            conditions.push('c.is_premium_only = 1');
        } else if (premium === 'false' || premium === '0') {
            conditions.push('c.is_premium_only = 0');
        }

        if (genre) {
            conditions.push(`c.id IN (
                SELECT cg.content_id FROM content_genres cg
                JOIN genres g ON cg.genre_id = g.id
                WHERE g.slug = ?
            )`);
            params.push(genre);
        }

        const whereClause = conditions.length
            ? `WHERE c.deleted_at IS NULL AND ${conditions.join(' AND ')}`
            : 'WHERE c.deleted_at IS NULL';

        const orderByMap = {
            rating: 'c.rating DESC',
            year: 'c.release_year DESC',
            title: 'c.title ASC',
            newest: 'c.created_at DESC',
        };

        const orderBy = orderByMap[sort] || 'c.rating DESC';
        const safeLimit = Math.min(Number(limit) || 20, 100);
        const safePage = Math.max(Number(page) || 1, 1);
        const safeOffset = (safePage - 1) * safeLimit;

        const [[{total}]] = await db.query(
            `SELECT COUNT (*) AS total
            FROM contents c
            ${whereClause}`, params
        );

        const [rows] = await db.query(
            `SELECT c.*,
                    GROUP_CONCAT(DISTINCT g.name ORDER BY g.name SEPARATOR ', ') AS genres
            FROM contents c
            LEFT JOIN content_genres cg ON c.id = cg.content_id
            LEFT JOIN genres g ON cg.genre_id = g.id
            ${whereClause}
            GROUP BY c.id
            ORDER BY ${orderBy}
            LIMIT ? OFFSET ?`,
            [...params, safeLimit, safeOffset]
        );

        return {
            contents: rows.map((r) => this._mapContent(r)),
            total,
            page: Math.floor(safeOffset / safeLimit) + 1,
            limit: safeLimit,
        };
    }

    async getContentById(id) {
        const validId = validateId(id);

        const [rows] = await db.query(
            `SELECT c.*,
                    GROUP_CONCAT(DISTINCT g.name ORDER BY g.name SEPARATOR ', ') AS genres
            FROM contents c
            LEFT JOIN content_genres cg ON c.id = cg.content_id
            LEFT JOIN genres g ON cg.genre_id = g.id
            WHERE c.id = ? AND c.deleted_at IS NULL
            GROUP BY c.id`,
            [validId]
        );

        if (!rows[0]) {
            throw new NotFoundError(MESSAGES.CONTENT_NOT_FOUND);
        }

        const content = this._mapContent(rows[0]);

        content.episodes = await this.getEpisodesByContentId(validId);
        content.recommendations = await this.getRecommendationsByContentId(validId);

        return content;
    }

        async getContentBySlug(slug) {
            if (!slug || typeof slug !== 'string' || slug.trim() === '') {
                throw new ValidationError(MESSAGES.CONTENT_NOT_FOUND);
            }

            const [rows] = await db.query(
                `SELECT c.*,
                        GROUP_CONCAT(DISTINCT g.name ORDER BY g.name SEPARATOR ', ') AS genres
                FROM contents c
                LEFT JOIN content_genres cg ON c.id = cg.content_id
                LEFT JOIN genres g ON cg.genre_id = g.id
                WHERE c.slug = ? AND c.deleted_at IS NULL
                GROUP BY c.id`,
                [slug.trim().toLowerCase()]
            );

            if (!rows[0]) {
                throw new NotFoundError(MESSAGES.CONTENT_NOT_FOUND);
            }

            const content = this._mapContent(rows[0]);
            content.episodes = await this.getEpisodesByContentId(content.id);
            content.recommendations = await this.getRecommendationsByContentId(content.id);
            
            return content;
    }

    async getEpisodesByContentId(contentId) {
        const validId = validateId(contentId);

        const [rows] = await db.query(
            `SELECT id, content_id, episode_number, title, description, duration_minutes, youtube_id, thumbnail_url,
                release_date
            FROM episodes
            WHERE content_id = ?
            ORDER BY episode_number ASC`,
            [validId]
        );

        return rows.map((e) => ({
            id: e.id,
            episodeNumber: e.episode_number,
            title: e.title,
            description: e.description,
            durationMinutes: e.duration_minutes,
            youtubeId: e.youtube_id,
            thumbnailUrl: e.thumbnail_url,
            releaseDate: e.release_date,
        }));
    }

    async getRecommendationsByContentId(contentId) {
        const validId = validateId(contentId);

        const [rows] = await db.query(
            `SELECT c.id, c.slug, c.title, c.content_type, c.rating,
                    c.poster_url, c.banner_url, c.age_rating,
                    GROUP_CONCAT(DISTINCT g.name ORDER BY g.name SEPARATOR ', ') AS genres
            FROM content_recommendations cr
            JOIN contents c ON cr.recommended_content_id = c.id
            LEFT JOIN content_genres cg ON c.id = cg.content_id
            LEFT JOIN genres g ON cg.genre_id = g.id
            WHERE cr.content_id = ?
            GROUP BY c.id
            ORDER BY cr.order_position ASC
            LIMIT 6`,
            [validId]
        );

        return rows.map((r) => this._mapContent(r));
    }

    async searchContents(query) {
        if (!query || typeof query !== 'string' || query.trim() === '') {
            throw new ValidationError('Search query is required');
        }

        const searchTerm = `%${query.trim()}%`;

        const [rows] = await db.query(
             `SELECT c.*,
                GROUP_CONCAT(DISTINCT g.name ORDER BY g.name SEPARATOR ', ') AS genres
            FROM contents c
            LEFT JOIN content_genres cg ON c.id = cg.content_id
            LEFT JOIN genres g ON cg.genre_id = g.id
            WHERE c.deleted_at IS NULL
            AND (c.title LIKE ? OR c.description LIKE ? OR c.creator LIKE ? OR c.cast LIKE ?)
            GROUP BY c.id
            ORDER BY c.rating DESC
            LIMIT 50`,
            [searchTerm, searchTerm, searchTerm, searchTerm]
        );

        return rows.map((r) => this._mapContent(r));
    }
}

module.exports = new ContentService();