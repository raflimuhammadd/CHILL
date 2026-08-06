const userService = require('../services/userService');

exports.getMe = async (req, res, next) => {
    try {
        const user = await userService.getProfile(req.user.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch(error) {
        next(error);
    }
};

exports.updateMe = async (req, res, next) => {
    try {
        const user = await userService.updateProfile(req.user.id, req.body);

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        if (error.message.includes('already in use')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        if (error.message.includes('Password')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};