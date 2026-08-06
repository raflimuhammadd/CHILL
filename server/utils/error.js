const { STATUS_CODES, ERROR_CODES } = require('./constant');

class AppError extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            code: this.code,
        };
    }

    toString() {
        return `${this.name}: ${this.message} (${this.statusCode})`;
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message, STATUS_CODES.BAD_REQUEST, ERROR_CODES.VALIDATION);
        this.name = 'ValidationError';
    }
}

class AuthError extends AppError {
    constructor(message) {
        super(message, STATUS_CODES.UNAUTHORIZED, ERROR_CODES.AUTH);
        this.name = 'AuthError';
    }
}

class ForbiddenError extends AppError {
    constructor(message) {
        super(message, STATUS_CODES.FORBIDDEN, ERROR_CODES.FORBIDDEN);
        this.name = 'ForbiddenError';
    }
}

class NotFoundError extends AppError {
    constructor(message) {
        super(message, STATUS_CODES.NOT_FOUND, ERROR_CODES.NOT_FOUND);
        this.name = 'NotFoundError';
    }
}

class ConflictError extends AppError {
    constructor(message) {
        super(message, STATUS_CODES.CONFLICT, ERROR_CODES.CONFLICT);
        this.name = 'ConflictError';
    }
}

class RateLimitError extends AppError {
    constructor(message) {
        super(message, STATUS_CODES.TOO_MANY_REQUESTS, ERROR_CODES.RATE_LIMIT);
        this.name = 'RateLimitError';
    }
}

function isOperationalError(error) {
    return error instanceof AppError && error.isOperational;
}

module.exports = {
    AppError,
    ValidationError,
    AuthError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    RateLimitError,
    isOperationalError,
};