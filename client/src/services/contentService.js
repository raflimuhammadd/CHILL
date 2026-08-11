import apiClient from './client';

const normalizeContent = (content) => {
    if (!content) return null;

    const normalized = {
        // identity
        id: String(content.id),
        slug: content.slug,
        type: content.type,

        // text
        title: content.title,
        description: content.description,

        // meta
        year: content.releaseYear,
        age: content.ageRating || '13+',
        rating: content.rating ? `${content.rating}/5` : '0/5',
        genres: content.genres || [],
        cast: Array.isArray(content.cast)
            ? content.cast
            : content.cast
                ? content.cast.split(', ').filter(Boolean)
                : [],
        creator: content.creator,

        // media
        youtubeId: content.youtubeId,
        image: content.posterUrl,
        hoverImage: content.bannerUrl,

        // flags
        isPremium: Boolean(content.isPremium),
        isNewRelease: Boolean(content.isNewRelease),
        hasNewEpisode: Boolean(content.hasNewEpisode),
        topRank: content.topRank || null,

        // movie vs series
        duration: content.durationMinutes ? `${content.durationMinutes}m` : undefined,
        totalEpisodes: content.totalEpisodes,

        // nested
        episodesList: (content.episodes || []).map((ep) => ({
            id: ep.episodeNumber,
            thumbnail: ep.thumbnailUrl,
            title: ep.title,
            description: ep.description,
            duration: ep.durationMinutes ? `${ep.durationMinutes}m` : undefined,
            youtubeId: ep.youtubeId,
        })),

        recommendations: (content.recommendations || []).map(normalizeContent).filter(Boolean),
    };

    return normalized;
};

const normalizeResponse = (response) => {
    const payload = response.data;
    const rawData = payload?.data ?? payload;

    // Case: list with pagination { contents, total, page, limit }
    if (rawData?.contents) {
        return {
            ...payload,
            data: {
                ...rawData,
                contents: rawData.contents.map(normalizeContent).filter(Boolean),
            },
        };
    }

    // Case: single content
    if (rawData?.id || rawData?.title) {
        return {
            ...payload,
            data: normalizeContent(rawData),
        };
    }

    return payload;
};

export const contentService = {
    async getAllContents(params = {}) {
        try {
            const response = await apiClient.get('/contents', { params });
            return normalizeResponse(response);
        } catch (error) {
            console.error('Error fetching contents:', error);
            throw error;
        }
    },

    async getContentById(id) {
        try {
            const response = await apiClient.get(`/contents/${id}`);
            return normalizeResponse(response);
        } catch (error) {
            console.error('Error fetching content by ID:', error);
            throw error;
        }
    },

    async getContentBySlug(slug) {
        try {
            const response = await apiClient.get(`/contents/slug/${slug}`);
            return normalizeResponse(response);
        } catch (error) {
            console.error('Error fetching content by slug:', error);
            throw error;
        }
    },

    async getEpisodes(contentId) {
        try {
            const response = await apiClient.get(`/contents/${contentId}/episodes`);
            return normalizeResponse(response);
        } catch (error) {
            console.error('Error fetching episodes:', error);
            throw error;
        }
    },

    async getRecommendations(contentId) {
        try {
            const response = await apiClient.get(`/contents/${contentId}/recommendations`);
            return normalizeResponse(response);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            throw error;
        }
    },

    async searchContents(query) {
        try {
            const response = await apiClient.get('/contents/search', {
                params: { q: query },
            });
            return normalizeResponse(response);
        } catch (error) {
            console.error('Error searching contents:', error);
            throw error;
        }
    },
};