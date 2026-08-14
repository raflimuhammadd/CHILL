const authService = require('./authService');
const { success } = require('../../utils/apiResponse');

exports.register = async (req, res, next) => {
    try {
        const { username, password, email } = req.body || {};
        const user = await authService.register({ username, password, email });

        const message = email 
            ? 'User registered successfully. Please check your email to verify your account.'
            : 'User registered successfully.';

        return success(res, user, message, 201);
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body || {};
        const result = await authService.login({ username, password });

        return success(res, result, 'User logged in successfully');
    } catch (error) {
        next(error);
    }
};

exports.verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.body || {};
        const result = await authService.verifyEmail(token);

        return success(res, result, result.message);
    } catch (error) {
        next(error);
    }
};

exports.resendVerification = async (req, res, next) => {
    try {
        const result = await authService.resendVerification(req.user.id);
        return success(res, result, result.message);
    } catch(error) {
        next(error);
    }
};