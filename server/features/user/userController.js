const userService = require('./userService');
const {success} = require('../../utils/apiResponse');
const { NotFoundError } = require('../../utils/error');


exports.getMe = async (req, res, next) => {
    try {
        const user = await userService.getProfile(req.user.id);
        
        if (!user) {
            throw new NotFoundError('User not found');
        }
        
        return success(res, user);
    } catch(error) {
        next(error);
    }
};

exports.updateMe = async (req, res, next) => {
    try {
        const user = await userService.updateProfile(req.user.id, req.body);

        return success(res, user, 'Profile updated successfully');
    } catch (error) {
        next(error);
    }
};

exports.getFavorites = async (req, res, next) => {
    try {
        const favorites = await userService.getFavorites(req.user.id);
        return success(res, favorites);
    } catch (error) {
        next(error);
    }
};

exports.addFavorite = async (req, res, next) => {
    try {
        const { contentId, notes } = req.body;
        await userService.addFavorite(req.user.id, contentId, notes);
        return success(res, null, 'Added to favorites');
    } catch (error) {
        next(error);
    }
};

exports.removeFavorite = async (req, res, next) => {
    try {
        const { contentId } = req.params;
        await userService.removeFavorite(req.user.id, contentId);
        return success(res, null, 'Removed from favorites');
    } catch (error) {
        next(error);
    }
};