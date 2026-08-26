const authService = require('./authService');
const { success } = require('../../utils/apiResponse');
const {AuthError} = require ('../../utils/error');

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
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];
        const result = await authService.login(
            { username, password }, ipAddress, userAgent
        );

        // Set accessToken cookie (15 mins)
        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 minutes
            path: '/',
        });

        // Set refreshToken cookie (30 days)
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            path: '/',
        });

        return success(res, {
            accessToken: result.accessToken,
            user: result.user,
        }, 'User logged in successfully');
    } catch (error) {
        next(error);
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new AuthError('Refresh token required');
        }

        const accessToken = await authService.refreshAccessToken(refreshToken);

        // Set new accessToken cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 minutes
            path: '/',
        });

        return success(res, { accessToken }, 'Access token refreshed');
    } catch (error) {
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        await authService.logout(req.user.id);
        
        // Clear both cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        
        return success(res, null, 'Logged out successfully');
    } catch (error) {
        next(error);
    }
}

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