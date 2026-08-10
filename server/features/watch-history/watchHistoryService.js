const db = require('../../config/database');
const { NotFoundError, ValidationError } = require('../../utils/error');
const { MESSAGES } = require('../../utils/constant');

class WatchHistoryService {
    /**
     * Get all watch history for a user
     * JOIN dengan contents & episodes untuk dapat title, poster, episode info
     */
    async getWatchHistory(userId) {
        const [rows] = await db.query(`
            SELECT 
                wh.id,
                wh.user_id AS userId,
                wh.content_id AS contentId,
                c.slug AS filmId,
                c.title,
                c.poster_url AS poster,
                c.total_episodes AS totalEpisodes,
                wh.episode_id AS episodeId,
                e.episode_number AS currentEpisode,
                wh.rating,
                wh.note,
                wh.status,
                wh.progress_seconds AS progressSeconds,
                wh.duration_seconds AS durationSeconds,
                wh.completed, 
                wh.last_watched_at AS watchedAt,
                wh.created_at AS createdAt
            FROM watch_history wh
            JOIN contents c ON wh.content_id = c.id
            LEFT JOIN episodes e ON wh.episode_id = e.id
            WHERE wh.user_id = ?
            ORDER BY wh.last_watched_at DESC
        `, [userId]);

        return rows;
    }

    /**
     * Add or update watch history
     * - Kalau sudah ada (user_id + content_id + episode_id), UPDATE
     * - Kalau belum ada, INSERT
     */
    async addWatchHistory(userId, data) {
        // 1. Lookup content_id dari slug
        const contentId = await this._getContentIdBySlug(data.filmId);

        // 2. Validasi episode_id (kalau series)
        let episodeId = null;
        if (data.currentEpisode && contentId) {
            try {
                episodeId = await this._getEpisodeId(contentId, data.currentEpisode);
            } catch(error) {
                console.log(`[WatchHistory] Episode ${data.currentEpisode} not found for 
                    content ${contentId} - treating as movie (episodeId=null)`);
            }
        }

        // 3. Validasi rating
        if (data.rating !== undefined) {
            if (data.rating < 1 || data.rating > 10) {
                throw new ValidationError('Rating must be between 1 and 10');
            }
        }

        // 4. Check apakah sudah ada record
        const [existing] = await db.query(`
            SELECT id FROM watch_history 
            WHERE user_id = ? AND content_id = ? AND (episode_id = ? OR (episode_id IS NULL AND ? IS NULL))
        `, [userId, contentId, episodeId, episodeId]);

        if (existing.length > 0) {
            // UPDATE existing
            await this._updateWatchHistory(existing[0].id, {
                ...data,
                episodeId,
                status: data.status || 'watching'
            });

            return this._getWatchHistoryById(existing[0].id);
        } else {
            // INSERT new
            const [result] = await db.query(`
                INSERT INTO watch_history 
                (user_id, content_id, episode_id, rating, note, status, progress_seconds, duration_seconds, last_watched_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `, [
                userId,
                contentId,
                episodeId,
                data.rating || null,
                data.note || null,
                data.status || 'watching',
                data.progressSeconds || 0,
                data.durationSeconds || 0
            ]);

            return this._getWatchHistoryById(result.insertId);
        }
    }

    /**
     * Update watch history (rating, note, status, episode)
     */
    async updateWatchHistory(userId, id, data) {
        // Cari watch history record
        const [rows] = await db.query(
            'SELECT id, content_id AS contentId FROM watch_history WHERE id = ? AND user_id = ?',
        [id, userId]);

        if (rows.length === 0) {
            throw new NotFoundError(MESSAGES.WATCH_HISTORY_NOT_FOUND);
        }

        const historyId = rows[0].id;
        const contentId = rows[0].contentId;

        // Update fields
        const updates = {};
        if (data.rating !== undefined) {
            if (data.rating < 1 || data.rating > 10) {
                throw new ValidationError('Rating must be between 1 and 10');
            }
            updates.rating = data.rating;
        }
        if (data.note !== undefined) updates.note = data.note;
        if (data.status !== undefined) updates.status = data.status;
        if (data.currentEpisode) {
            const contentIdInt = await this._getContentIdBySlug(contentId);
            try {
                updates.episode_id = await this._getEpisodeId(contentIdInt, data.currentEpisode);
            } catch (error) {
                console.log(`[WatchHistory] Episode ${data.currentEpisode} not found for content ${contentId} - keeping episodeId unchanged`)
            }
            updates.episode_id = await this._getEpisodeId(contentIdInt, data.currentEpisode);
        }
        if (data.durationSeconds !== undefined) updates.duration_seconds = data.durationSeconds;

        // Build dynamic UPDATE
        if (Object.keys(updates).length > 0) {
            const setClause = Object.keys(updates).map(k => `${k} = ?`).join(', ');
            const values = [...Object.values(updates), historyId];
            await db.query(`UPDATE watch_history SET ${setClause}, last_watched_at = NOW() WHERE id = ?`, values);
        }

        return this._getWatchHistoryById(historyId);
    }

    /**
     * Delete watch history
     */
    async deleteWatchHistory(userId, id) {
        const [result] = await db.query(
            'DELETE FROM watch_history WHERE id = ? AND user_id = ?',
            [id, userId]);

        if (result.affectedRows === 0) {
            throw new NotFoundError(MESSAGES.WATCH_HISTORY_NOT_FOUND);
        }

        return { message: 'Watch history deleted successfully' };
    }

    /**
     * Helper: Get content_id from slug
     */
    async _getContentIdBySlug(identifier) {
        if (!isNaN(parseInt(identifier))) {
            const [rows] = await db.query(
                'SELECT id, slug FROM contents WHERE id = ?',
                [identifier]
            );
            if (rows.length === 0) throw new NotFoundError(MESSAGES.CONTENT_NOT_FOUND);
            return rows[0].id;
        }

        const [rows] = await db.query(
            'SELECT id FROM contents WHERE slug = ? AND deleted_at IS NULL',
            [identifier]
        );
        if (rows.length === 0) throw new NotFoundError(MESSAGES.CONTENT_NOT_FOUND);
        return rows[0].id;
    }

    /**
     * Helper: Get episode_id from content_id + episode_number
     */
    async _getEpisodeId(contentId, episodeNumber) {
        const [rows] = await db.query(
            'SELECT id FROM episodes WHERE content_id = ? AND episode_number = ?',
            [contentId, episodeNumber]
        );
        if (rows.length === 0) {
            throw new NotFoundError(MESSAGES.EPISODE_NOT_FOUND);
        }
        return rows[0].id;
    }

    /**
     * Helper: Get single watch history by ID
     */
    async _getWatchHistoryById(id) {
        const [rows] = await db.query(`
            SELECT 
                wh.id,
                wh.user_id AS userId,
                wh.content_id AS contentId,
                c.slug AS filmId,
                c.title,
                c.poster_url AS poster,
                c.total_episodes AS totalEpisodes,
                wh.episode_id AS episodeId,
                e.episode_number AS currentEpisode,
                wh.rating,
                wh.note,
                wh.status,
                wh.progress_seconds AS progressSeconds,
                wh.duration_seconds AS durationSeconds,
                wh.completed,
                wh.last_watched_at AS watchedAt,
                wh.created_at AS createdAt
            FROM watch_history wh
            JOIN contents c ON wh.content_id = c.id
            LEFT JOIN episodes e ON wh.episode_id = e.id
            WHERE wh.id = ?
        `, [id]);

        return rows[0] || null;
    }

    /**
     * Helper: Update watch history by ID
     */
    async _updateWatchHistory(id, data) {
        const fields = [];
        const values = [];

        if (data.rating !== undefined) {
            fields.push('rating = ?');
            values.push(data.rating);
        }
        if (data.note !== undefined) {
            fields.push('note = ?');
            values.push(data.note);
        }
        if (data.status !== undefined) {
            fields.push('status = ?');
            values.push(data.status);
        }
        if (data.episodeId !== undefined) {
            fields.push('episode_id = ?');
            values.push(data.episodeId);
        }
        if (data.progressSeconds !== undefined) {
            fields.push('progress_seconds = ?');
            values.push(data.progressSeconds);
        }
        if (data.durationSeconds !== undefined) {
            fields.push('duration_seconds = ?');
            values.push(data.durationSeconds);
        }

        if (fields.length > 0) {
            fields.push('last_watched_at = NOW()');
            values.push(id);
            await db.query(`UPDATE watch_history SET ${fields.join(', ')} WHERE id = ?`, values);
        }
    }
}

module.exports = new WatchHistoryService();