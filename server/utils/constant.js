module.exports = {
    // ===== VALIDATION RULES =====
    USERNAME_MIN: 3,
    USERNAME_MAX: 20,
    PASSWORD_MIN: 6,
    
    // ===== HTTP STATUS CODES =====
    HTTP_OK: 200,
    HTTP_CREATED: 201,
    HTTP_BAD_REQUEST: 400,
    HTTP_UNAUTHORIZED: 401,
    HTTP_NOT_FOUND: 404,
    HTTP_CONFLICT: 409,
    HTTP_TOO_MANY_REQUESTS: 429,
    HTTP_SERVER_ERROR: 500,
    
    // ===== ERROR MESSAGES (English) =====
    MSG: {
        // Auth
        USERNAME_REQUIRED: 'Username is required',
        USERNAME_LENGTH: 'Username must be between 3 and 20 characters',
        USERNAME_FORMAT: 'Username must only contain letters, numbers, and underscores',
        USERNAME_TAKEN: 'Username already taken',
        
        PASSWORD_REQUIRED: 'Password is required',
        PASSWORD_LENGTH: 'Password must be at least 6 characters',
        
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
        GENRE_NOT_FOUND: 'Genre not found',
        GENRE_SLUG_EXISTS: 'Slug already exists',
        
        // General
        INVALID_ID: 'Invalid ID. Must be a positive number',
        
        // Rate Limit
        TOO_MANY_REQUESTS: 'Too many requests, please try again later',
        TOO_MANY_AUTH_ATTEMPTS: 'Too many login attempts, please try again later',
    },
    
    // ===== SECURITY =====
    BCRYPT_ROUNDS: 10,
    JWT_EXPIRES: '7d',
};