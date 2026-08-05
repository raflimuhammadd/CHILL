const authService = require('../services/authService');

exports.register = async (req, res, next) => {
    try {
        const {username, password} = req.body || {};
        const user = await authService.register({username, password});

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: user
        });
    } catch(error) {
        if (error.message.includes('required') ||
            error.message.includes('characters') ||
            error.message.includes('only contain') ||
            error.message.includes('at least') ||
            error.message.includes('already taken')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
    }
};


exports.login = async (req, res, next) => {
   try {
    const {username, password} = req.body || {};
    const result = await authService.login({username, password});

    return res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: result
    });
   } catch(error) {
        if (error.message.includes('required')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        if (error.message.includes('Invald username or password')) {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }
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
        res.status(200).json({
            success: true,
            data: user
        });
    } catch(error) {
        next(error);
    }
};