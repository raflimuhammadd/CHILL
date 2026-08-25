const jwt = require('jsonwebtoken');
const {AuthError} = require('../utils/error');

module.exports = (req, res, next) => {
    // Priority 1: Check Authorization header (for API clients)
    let token = null;
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    
    // Priority 2: Check accessToken cookie (for browsers)
    if (!token && req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        throw new AuthError('No token provided, please login first.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = {
            id: decoded.id,
            username: decoded.username,
            tokenVersion: decoded.tokenVersion,
        };
        
        next();
    } catch(error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Access token expired',
                code: 'TOKEN_EXPIRED',
            });
        }
        
        return res.status(401).json({
            success: false,
            message: 'Invalid token, Please login first.',
            code: 'INVALID_TOKEN',
        });
    }
};