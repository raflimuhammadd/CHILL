const watchHistoryService = require('./watchHistoryService');
const { success } = require('../../utils/apiResponse');


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
        const {id} = req.params;
        const userId = req.user.id;
        const history = await watchHistoryService.updateWatchHistory(userId, id, req.body);
        return success(res, history, 'Watch history updated successfully');
    } catch (error) {
        next(error);
    }
};

exports.deleteWatchHistory = async (req, res, next) => {
    try {
        const {id} = req.params;
        const userId = req.user.id;
        const result = await watchHistoryService.deleteWatchHistory(userId, id);
        return success(res, result, 'Watch history deleted successfully');
    } catch (error) {
        next(error);
    }
};