const jwt = require('jsonwebtoken');
const { AuthError } = require('../utils/error');
const authService = require('../features/auth/authService');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    // Case 1: Valid Authorization header provided
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = {
                id: decoded.id,
                username: decoded.username,
                tokenVersion: decoded.tokenVersion,
            };
            return next();
        } catch (err) {
            // Token invalid or expired, fall through to refresh token check
            if (err.name !== 'TokenExpiredError') {
                throw new AuthError('Invalid token, Please login first.');
            }
        }
    }
    
    // Case 2: No valid token, try refresh token cookie
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
        throw new AuthError('No token provided, please login first.');
    }
    
    try {
        const user = await authService.verifyRefreshToken(refreshToken);
        const newAccessToken = authService.generateAccessToken(user);
        
        req.user = {
            id: user.id,
            username: user.username,
            tokenVersion: user.refresh_token_version,
        };
        
        req.newAccessToken = newAccessToken;
        
        next();
    } catch (err) {
        throw new AuthError('Session expired, please login again.');
    }
};