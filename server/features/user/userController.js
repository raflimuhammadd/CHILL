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