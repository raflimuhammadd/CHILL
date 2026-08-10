const authService = require('./authService');
const {success} = require('../../utils/apiResponse');

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