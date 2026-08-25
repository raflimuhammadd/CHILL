const jwt = require('jsonwebtoken');
const {AuthError} = require('../utils/error');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AuthError('No token provided, please login first.');
    }

    const token = authHeader.split(' ')[1];

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