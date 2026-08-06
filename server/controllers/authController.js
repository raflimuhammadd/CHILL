const authService = require('../services/authService');
const {success} = require('../utils/apiResponse');

exports.register = async (req, res, next) => {
    try {
        const {username, password} = req.body || {};
        const user = await authService.register({username, password});

        return success(
            res, 
            user, 
            'User registered successfully',
            201
        );
    } catch(error) {
        next(error);
    }
};


exports.login = async (req, res, next) => {
   try {
    const {username, password} = req.body || {};
    const result = await authService.login({username, password});

    return success(
        res, 
        result,
        'User logged in successfully'
    );
   } catch(error) {
        next(error);
   }
};

exports.me = async (req, res, next) => {
    try {
        const user = await authService.getUserById(req.user.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }
        return success(
            res,
            user
        );
    } catch(error) {
        next(error);
    }
};