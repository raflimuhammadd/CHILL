const USERNAME_MIN = 3;
const USERNAME_MAX = 20;
const PASSWORD_MIN = 6;
const PASSWORD_MAX = 50;
const GENRE_NAME_MIN = 2;
const GENRE_NAME_MAX = 50;

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORIZED = 401;
const HTTP_FORBIDDEN = 403;
const HTTP_NOT_FOUND = 404;
const HTTP_CONFLICT = 409;
const HTTP_UNPROCESSABLE_ENTITY = 422;
const HTTP_TOO_MANY_REQUESTS = 429;
const HTTP_SERVER_ERROR = 500;

const ERROR_CODES = {
    VALIDATION: 'VALIDATION_ERROR',
    AUTH: 'AUTHENTICATION_ERROR',
    NOT_FOUND: 'NOT_FOUND_ERROR',
    CONFLICT: 'CONFLICT_ERROR',
    SERVER: 'INTERNAL_SERVER_ERROR',
    RATE_LIMIT: 'RATE_LIMIT_ERROR',
    FORBIDDEN: 'FORBIDDEN_ERROR'
};

const MSG = {
    // Auth
    USERNAME_REQUIRED: 'Username is required',
    USERNAME_LENGTH: `Username must be between ${USERNAME_MIN} and ${USERNAME_MAX} characters`,
    USERNAME_FORMAT: 'Username must only contain letters, numbers, and underscores',
    USERNAME_TAKEN: 'Username already taken',

    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_LENGTH: `Password must be at least ${PASSWORD_MIN} characters`,

    USERNAME_PASSWORD_REQUIRED: 'Username and password are required',
    INVALID_CREDENTIALS: 'Invalid username or password',

    // User
    USER_NOT_FOUND: 'User not found',
    EMAIL_IN_USE: 'Email already in use',

    // Token
    NO_TOKEN: 'No token provided, please login first',
    INVALID_TOKEN: 'Invalid token, please login first',

    // Genre
    GENRE_NAME_REQUIRED: 'Genre name is required',
    GENRE_NAME_EMPTY: 'Genre name cannot be empty',
    GENRE_NOT_FOUND: 'Genre not found',
    GENRE_SLUG_EXISTS: 'Slug already exists',

    // General
    INVALID_ID: 'Invalid ID. Must be a positive number',
    SERVER_ERROR: 'Internal server error',

    // Rate Limit
    TOO_MANY_REQUESTS: 'Too many requests, please try again later',
    TOO_MANY_AUTH_ATTEMPTS: 'Too many login attempts, please try again later',
};

const BCRYPT_ROUNDS = 10;
const JWT_EXPIRES = '7d';

// ===== RATE LIMIT =====
const RATE_LIMIT = {
    GENERAL_WINDOW_MS: 15 * 60 * 1000, // 15 menit
    GENERAL_MAX_REQUESTS: 100,
    AUTH_WINDOW_MS: 15 * 60 * 1000, // 15 menit
    AUTH_MAX_REQUESTS: 5,
    STRICT_WINDOW_MS: 60 * 60 * 1000, // 1 jam
    STRICT_MAX_REQUESTS: 3,
};

// ===== SECURITY DEFAULTS =====
const SECURITY = {
    DEFAULT_JWT_EXPIRES_IN: '7d',
    DEFAULT_BCRYPT_SALT_ROUNDS: 10,
    MIN_BCRYPT_SALT_ROUNDS: 8,
    MAX_BCRYPT_SALT_ROUNDS: 10,
};

const VALIDATION = {
    USERNAME_MIN_LENGTH: USERNAME_MIN,
    USERNAME_MAX_LENGTH: USERNAME_MAX,
    USERNAME_PATTERN: /^[a-zA-Z0-9_]+$/,
    PASSWORD_MIN_LENGTH: PASSWORD_MIN,
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MIN_ID: 1,
    GENRE_NAME_MIN_LENGTH: GENRE_NAME_MIN,
    GENRE_NAME_MAX_LENGTH: GENRE_NAME_MAX,
    GENRE_SLUG_PATTERN: /^[a-z0-9-]+$/,
};

// ALIAS for imports file { STATUS_CODES }
const STATUS_CODES = {
    OK: HTTP_OK,
    CREATED: HTTP_CREATED,
    BAD_REQUEST: HTTP_BAD_REQUEST,
    UNAUTHORIZED: HTTP_UNAUTHORIZED,
    FORBIDDEN: HTTP_FORBIDDEN,
    NOT_FOUND: HTTP_NOT_FOUND,
    CONFLICT: HTTP_CONFLICT,
    UNPROCESSABLE_ENTITY: HTTP_UNPROCESSABLE_ENTITY,
    TOO_MANY_REQUESTS: HTTP_TOO_MANY_REQUESTS,
    SERVER_ERROR: HTTP_SERVER_ERROR,
};

const MESSAGES = MSG;

module.exports = {
    // flat
    USERNAME_MIN,
    USERNAME_MAX,
    PASSWORD_MIN,
    BCRYPT_ROUNDS,
    JWT_EXPIRES,
    HTTP_OK,
    HTTP_CREATED,
    HTTP_BAD_REQUEST,
    HTTP_UNAUTHORIZED,
    HTTP_FORBIDDEN,
    HTTP_NOT_FOUND,
    HTTP_CONFLICT,
    HTTP_UNPROCESSABLE_ENTITY,
    HTTP_TOO_MANY_REQUESTS,
    HTTP_SERVER_ERROR,
    MSG,

    // namespace
    VALIDATION,
    MESSAGES,
    STATUS_CODES,
    ERROR_CODES,
    SECURITY,
    RATE_LIMIT,
};