const watchHistoryService = require('../services/watchHistoryService');
const { success } = require('../utils/apiResponse');

exports.getWatchHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const history = await watchHistoryService.getWatchHistory(userId);
        return success(res, history, 'Watch history retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.addWatchHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const history = await watchHistoryService.addWatchHistory(userId, req.body);
        return success(res, history, 'Watch history added successfully', 201);
    } catch (error) {
        next(error);
    }
};

exports.updateWatchHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { contentId } = req.params; // contentId = slug (string)
        const history = await watchHistoryService.updateWatchHistory(userId, contentId, req.body);
        return success(res, history, 'Watch history updated successfully');
    } catch (error) {
        next(error);
    }
};

exports.deleteWatchHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { contentId } = req.params; // contentId = slug (string)
        const result = await watchHistoryService.deleteWatchHistory(userId, contentId);
        return success(res, result, 'Watch history deleted successfully');
    } catch (error) {
        next(error);
    }
};