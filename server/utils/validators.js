const { ValidationError } = require('./error');
const { VALIDATION, MESSAGES } = require('./constant');

function validateUsername(username) {
    if (username === undefined || username === null) {
        throw new ValidationError(MESSAGES.USERNAME_REQUIRED);
    }

    const trimmed = String(username).trim();

    if (trimmed === '') {
        throw new ValidationError(MESSAGES.USERNAME_REQUIRED);
    }

    if (trimmed.length < VALIDATION.USERNAME_MIN_LENGTH ||
        trimmed.length > VALIDATION.USERNAME_MAX_LENGTH) {
        throw new ValidationError(MESSAGES.USERNAME_LENGTH);
    }

    if (!VALIDATION.USERNAME_PATTERN.test(trimmed)) {
        throw new ValidationError(MESSAGES.USERNAME_FORMAT);
    }

    return trimmed.toLowerCase();
}

function validatePassword(password) {
    if (password === undefined || password === null) {
        throw new ValidationError(MESSAGES.PASSWORD_REQUIRED);
    }

    const pwd = String(password);

    if (pwd === '') {
        throw new ValidationError(MESSAGES.PASSWORD_REQUIRED);
    }

    if (pwd.length < VALIDATION.PASSWORD_MIN_LENGTH) {
        throw new ValidationError(MESSAGES.PASSWORD_LENGTH);
    }

    return pwd;
}

function validateEmail(email) {
    if (email === undefined || email === null) {
        return null; // email opsional
    }

    const trimmed = String(email).trim();

    if (trimmed === '') {
        return null;
    }

    if (!VALIDATION.EMAIL_PATTERN.test(trimmed)) {
        throw new ValidationError('Invalid email format');
    }

    return trimmed.toLowerCase();
}

function validateId(id) {
    if (id === undefined || id === null) {
        throw new ValidationError(MESSAGES.INVALID_ID);
    }

    const numId = Number(id);

    if (isNaN(numId) || !Number.isInteger(numId) || numId < VALIDATION.MIN_ID) {
        throw new ValidationError(MESSAGES.INVALID_ID);
    }

    return numId;
}

function validateGenreName(name) {
    if (name === undefined || name === null) {
        throw new ValidationError(MESSAGES.GENRE_NAME_REQUIRED);
    }

    const trimmed = String(name).trim();

    if (trimmed === '') {
        throw new ValidationError(MESSAGES.GENRE_NAME_EMPTY);
    }

    if (trimmed.length < VALIDATION.GENRE_NAME_MIN_LENGTH ||
        trimmed.length > VALIDATION.GENRE_NAME_MAX_LENGTH) {
        throw new ValidationError(
            `Genre name must be between ${VALIDATION.GENRE_NAME_MIN_LENGTH} and ${VALIDATION.GENRE_NAME_MAX_LENGTH} characters`
        );
    }

    return trimmed;
}

function validateGenreSlug(slug) {
    if (slug === undefined || slug === null) {
        throw new ValidationError('Genre slug is required');
    }

    const normalized = String(slug).trim().toLowerCase();

    if (normalized === '') {
        throw new ValidationError('Genre slug cannot be empty');
    }

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