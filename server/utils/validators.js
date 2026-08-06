const { ValidationError } = require('./errors');
const { VALIDATION, MESSAGES } = require('./constants');

function validateUsername(username) {
    // Check if undefined/null
    if (username === undefined || username === null) {
        throw new ValidationError(MESSAGES.USERNAME_REQUIRED);
    }
    
    // Convert ke string & trim
    const trimmed = String(username).trim();
    
    // Check if empty after trim
    if (trimmed === '') {
        throw new ValidationError(MESSAGES.USERNAME_REQUIRED);
    }
    
    // Check length
    if (trimmed.length < VALIDATION.USERNAME_MIN_LENGTH || 
        trimmed.length > VALIDATION.USERNAME_MAX_LENGTH) {
        throw new ValidationError(MESSAGES.USERNAME_LENGTH);
    }
    
    // Check format (alphanumeric + underscore)
    if (!VALIDATION.USERNAME_PATTERN.test(trimmed)) {
        throw new ValidationError(MESSAGES.USERNAME_FORMAT);
    }
    
    // Return normalized (trimmed & lowercase untuk consistency)
    return trimmed.toLowerCase();
}

function validatePassword(password) {
    // Check if undefined/null
    if (password === undefined || password === null) {
        throw new ValidationError(MESSAGES.PASSWORD_REQUIRED);
    }
    
    // Convert ke string
    const pwd = String(password);
    
    // Check if empty
    if (pwd === '') {
        throw new ValidationError(MESSAGES.PASSWORD_REQUIRED);
    }
    
    // Check minimum length
    if (pwd.length < VALIDATION.PASSWORD_MIN_LENGTH) {
        throw new ValidationError(MESSAGES.PASSWORD_LENGTH);
    }
    
    // Return as-is (no trim/lowercase untuk password)
    return pwd;
}

function validateEmail(email) {
    // Check if undefined/null
    if (email === undefined || email === null) {
        throw new ValidationError(MESSAGES.EMAIL_REQUIRED);
    }
    
    // Convert ke string & trim
    const trimmed = String(email).trim();
    
    // Check if empty
    if (trimmed === '') {
        throw new ValidationError(MESSAGES.EMAIL_REQUIRED);
    }
    
    // Check format dengan regex
    if (!VALIDATION.EMAIL_PATTERN.test(trimmed)) {
        throw new ValidationError(MESSAGES.EMAIL_FORMAT);
    }
    
    // Return normalized (lowercase untuk email consistency)
    return trimmed.toLowerCase();
}

function validateId(id) {
    // Check if undefined/null
    if (id === undefined || id === null) {
        throw new ValidationError(MESSAGES.INVALID_ID);
    }
    
    // Convert ke number
    const numId = Number(id);
    
    // Check if NaN
    if (isNaN(numId)) {
        throw new ValidationError(MESSAGES.INVALID_ID);
    }
    
    // Check if positive integer
    if (!Number.isInteger(numId) || numId < VALIDATION.MIN_ID) {
        throw new ValidationError(MESSAGES.INVALID_ID);
    }
    
    return numId;
}

function validateGenreName(name) {
    // Check if undefined/null
    if (name === undefined || name === null) {
        throw new ValidationError(MESSAGES.GENRE_NAME_REQUIRED);
    }
    
    // Convert ke string & trim
    const trimmed = String(name).trim();
    
    // Check if empty
    if (trimmed === '') {
        throw new ValidationError(MESSAGES.GENRE_NAME_EMPTY);
    }
    
    // Check length
    if (trimmed.length < VALIDATION.GENRE_NAME_MIN_LENGTH || 
        trimmed.length > VALIDATION.GENRE_NAME_MAX_LENGTH) {
        throw new ValidationError(
            `Genre name must be between ${VALIDATION.GENRE_NAME_MIN_LENGTH} and ${VALIDATION.GENRE_NAME_MAX_LENGTH} characters`
        );
    }
    
    return trimmed;
}

function validateGenreSlug(slug) {
    // Check if undefined/null
    if (slug === undefined || slug === null) {
        throw new ValidationError('Genre slug is required');
    }
    
    // Convert ke string, trim & lowercase
    const normalized = String(slug).trim().toLowerCase();
    
    // Check if empty
    if (normalized === '') {
        throw new ValidationError('Genre slug cannot be empty');
    }
    
    // Check format (lowercase alphanumeric + hyphens)
    if (!VALIDATION.GENRE_SLUG_PATTERN.test(normalized)) {
        throw new ValidationError(
            'Genre slug must contain only lowercase letters, numbers, and hyphens'
        );
    }
    
    return normalized;
}


module.exports = {
    validateUsername,
    validatePassword,
    validateEmail,
    validateId,
    validateGenreName,
    validateGenreSlug,
};