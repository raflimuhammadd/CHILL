/**
 * Rate Limiter Middleware
 * Implements rate limiting untuk prevent brute force attacks dan API abuse
 * Uses express-rate-limit package
 */

const rateLimit = require('express-rate-limit');
const { STATUS_CODES, MESSAGES, RATE_LIMIT } = require('../utils/constants');

/**
 * Custom handler untuk rate limit exceeded
 * Returns consistent JSON response format
 */
function rateLimitHandler(req, res) {
    return res.status(STATUS_CODES.TOO_MANY_REQUESTS).json({
        success: false,
        message: MESSAGES.TOO_MANY_REQUESTS,
        retryAfter: req.rateLimit.resetTime
    });
}

/**
 * Custom handler untuk auth-specific rate limit
 */
function authRateLimitHandler(req, res) {
    return res.status(STATUS_CODES.TOO_MANY_REQUESTS).json({
        success: false,
        message: MESSAGES.TOO_MANY_AUTH_ATTEMPTS,
        retryAfter: req.rateLimit.resetTime,
        hint: 'Too many failed attempts. Please try again later.'
    });
}

/**
 * General Rate Limiter
 * Untuk general API endpoints
 * 
 * Config:
 * - Window: 15 minutes
 * - Max requests: 100 per window
 * - Key: IP address (default)
 */
const generalLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || RATE_LIMIT.GENERAL_WINDOW_MS,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || RATE_LIMIT.GENERAL_MAX_REQUESTS,
    
    // Custom message & handler
    message: MESSAGES.TOO_MANY_REQUESTS,
    handler: rateLimitHandler,
    
    // Standardize headers
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false,  // Disable `X-RateLimit-*` headers
    
    // Skip jika development (optional)
    skip: (req) => {
        // Skip rate limit di development untuk easier testing
        return process.env.NODE_ENV === 'development';
    },
    
    // Key generator (default: IP address)
    // Bisa di-customize untuk use user ID, API key, etc
    keyGenerator: (req) => {
        // Use IP address dari proxy-aware headers
        return req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    }
});

/**
 * Auth Rate Limiter
 * Untuk authentication endpoints (login, register)
 * Lebih strict untuk prevent brute force attacks
 * 
 * Config:
 * - Window: 15 minutes
 * - Max requests: 5 per window (strict!)
 * - Key: IP address
 */
const authLimiter = rateLimit({
    windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || RATE_LIMIT.AUTH_WINDOW_MS,
    max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || RATE_LIMIT.AUTH_MAX_REQUESTS,
    
    message: MESSAGES.TOO_MANY_AUTH_ATTEMPTS,
    handler: authRateLimitHandler,
    
    standardHeaders: true,
    legacyHeaders: false,
    
    // Skip di development
    skip: (req) => {
        return process.env.NODE_ENV === 'development';
    },
    
    keyGenerator: (req) => {
        return req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    }
});

/**
 * Strict Rate Limiter
 * Untuk sensitive operations (password change, account deletion)
 * Paling strict untuk prevent abuse
 * 
 * Config:
 * - Window: 1 hour
 * - Max requests: 3 per window (very strict!)
 * - Key: IP address
 */
const strictLimiter = rateLimit({
    windowMs: parseInt(process.env.STRICT_RATE_LIMIT_WINDOW_MS) || RATE_LIMIT.STRICT_WINDOW_MS,
    max: parseInt(process.env.STRICT_RATE_LIMIT_MAX_REQUESTS) || RATE_LIMIT.STRICT_MAX_REQUESTS,
    
    message: 'Too many attempts, please try again later',
    handler: rateLimitHandler,
    
    standardHeaders: true,
    legacyHeaders: false,
    
    // Skip di development
    skip: (req) => {
        return process.env.NODE_ENV === 'development';
    },
    
    keyGenerator: (req) => {
        return req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    }
});


module.exports = {
    generalLimiter,
    authLimiter,
    strictLimiter
};