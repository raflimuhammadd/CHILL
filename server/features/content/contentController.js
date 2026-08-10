const contentService = require('../../services/contentService');
const { success } = require('../../utils/apiResponse');

exports.getAllContents = async (req, res, next) => {
    try {
        const result = await contentService.getAllContents(req.query);
        return success(res, result, 'Contents fetched successfully');
    } catch (error) {
        next(error);
    }
};

exports.getContentById = async (req, res, next) => {
   try {
        const content = await contentService.getContentById(req.params.id);
        return success(res, content, 'Content fetched successfully');
   } catch (error) {
    next(error);
   }
};

exports.getContentBySlug = async (req, res, next) => {
    try {
        const content = await contentService.getContentBySlug(req.params.slug);
        return success(res, content, 'Content fetched successfully');
    } catch(error) {
        next(error);
    }
};

exports.getEpisodes = async (req, res, next) => {
    try {
        const episodes = await contentService.getEpisodesByContentId(req.params.id);
        return success(res, episodes, 'Episodes fetched successfully');
    } catch(error) {
        next(error);
    }
};

exports.getRecommendations = async (req, res, next) => {
    try {
        const recommendations = await contentService.getRecommendationsByContentId(req.params.id);
        return success(res, recommendations, 'Recommendations fetched successfully');
    } catch (error) {
        next(error);
    }
};

exports.searchContents = async (req, res, next) => {
    try {
        const results = await contentService.searchContents(req.query.q);
        return success(res, results, 'Search Completed');
    } catch (error) {
        next(error);
    }
};