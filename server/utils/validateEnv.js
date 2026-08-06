/**
 * Environment Variables Validator
 * Validates semua required environment variables saat server startup
 * Process akan EXIT jika ada critical config yang missing
 */

const { MESSAGES, SECURITY } = require('./constant');

/**
 * Validate environment variables
 * Called di top of server/index.js sebelum app initialization
 * 
 * @throws {Error} - Exits process jika validation fails
 */
function validateEnv() {
    console.log('Validating environment variables...');
    
    const errors = [];
    const warnings = [];
    
    // ==================== CRITICAL VALIDATIONS ====================
    // Jika fails, server MUST NOT start
    
    // 1. JWT_SECRET - Critical untuk authentication
    if (!process.env.JWT_SECRET) {
        errors.push('JWT_SECRET is required for authentication');
    } else if (process.env.JWT_SECRET.length < 32) {
        warnings.push('JWT_SECRET should be at least 32 characters for security');
    }
    
    // 2. Database configuration - Critical untuk data access
    if (!process.env.DB_HOST) {
        errors.push('DB_HOST is required');
    }
    
    if (!process.env.DB_USER) {
        errors.push('DB_USER is required');
    }
    
    if (!process.env.DB_NAME) {
        errors.push('DB_NAME is required');
    }
    
    // DB_PASSWORD bisa empty (for localhost development)
    if (process.env.DB_PASSWORD === undefined) {
        warnings.push('DB_PASSWORD is not set (using empty password)');
    }
    
    // ==================== OPTIONAL VALIDATIONS ====================
    // Non-critical, tapi perlu warning
    
    // 3. NODE_ENV - Optional, default ke 'development'
    const validNodeEnvs = ['development', 'production', 'test'];
    if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = 'development';
        warnings.push('NODE_ENV not set, defaulting to "development"');
    } else if (!validNodeEnvs.includes(process.env.NODE_ENV)) {
        warnings.push(
            `NODE_ENV="${process.env.NODE_ENV}" is not standard. ` +
            `Expected: ${validNodeEnvs.join(', ')}`
        );
    }
    
    // 4. JWT_EXPIRES_IN - Optional, default ke '7d'
    if (!process.env.JWT_EXPIRES_IN) {
        process.env.JWT_EXPIRES_IN = SECURITY.DEFAULT_JWT_EXPIRES_IN;
        warnings.push(`JWT_EXPIRES_IN not set, defaulting to "${SECURITY.DEFAULT_JWT_EXPIRES_IN}"`);
    }
    
    // 5. BCRYPT_SALT_ROUNDS - Optional, default ke 10
    if (!process.env.BCRYPT_SALT_ROUNDS) {
        process.env.BCRYPT_SALT_ROUNDS = String(SECURITY.DEFAULT_BCRYPT_SALT_ROUNDS);
        warnings.push(
            `BCRYPT_SALT_ROUNDS not set, defaulting to ${SECURITY.DEFAULT_BCRYPT_SALT_ROUNDS}`
        );
    } else {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);
        
        if (isNaN(saltRounds)) {
            warnings.push(
                `BCRYPT_SALT_ROUNDS="${process.env.BCRYPT_SALT_ROUNDS}" is not a number. ` +
                `Using default: ${SECURITY.DEFAULT_BCRYPT_SALT_ROUNDS}`
            );
            process.env.BCRYPT_SALT_ROUNDS = String(SECURITY.DEFAULT_BCRYPT_SALT_ROUNDS);
        } else if (saltRounds < SECURITY.MIN_BCRYPT_SALT_ROUNDS || 
                   saltRounds > SECURITY.MAX_BCRYPT_SALT_ROUNDS) {
            warnings.push(
                `BCRYPT_SALT_ROUNDS=${saltRounds} is outside safe range ` +
                `(${SECURITY.MIN_BCRYPT_SALT_ROUNDS}-${SECURITY.MAX_BCRYPT_SALT_ROUNDS}). ` +
                `Using default: ${SECURITY.DEFAULT_BCRYPT_SALT_ROUNDS}`
            );
            process.env.BCRYPT_SALT_ROUNDS = String(SECURITY.DEFAULT_BCRYPT_SALT_ROUNDS);
        }
    }
    
    // 6. PORT - Optional, default ke 3000
    if (!process.env.PORT) {
        process.env.PORT = '3000';
        warnings.push('PORT not set, defaulting to 3000');
    } else {
        const port = parseInt(process.env.PORT, 10);
        if (isNaN(port) || port < 1 || port > 65535) {
            warnings.push(`PORT=${process.env.PORT} is invalid. Using 3000`);
            process.env.PORT = '3000';
        }
    }
    
    // 7. CLIENT_URL - Optional untuk CORS
    if (!process.env.CLIENT_URL) {
        process.env.CLIENT_URL = 'http://localhost:5173';
        warnings.push('CLIENT_URL not set, defaulting to "http://localhost:5173"');
    }
    
    // ==================== RATE LIMIT VALIDATIONS ====================
    // Optional, akan di-set defaults di rate limiter middleware
    
    if (!process.env.RATE_LIMIT_WINDOW_MS) {
        warnings.push('RATE_LIMIT_WINDOW_MS not set, using defaults in middleware');
    }
    
    if (!process.env.RATE_LIMIT_MAX_REQUESTS) {
        warnings.push('RATE_LIMIT_MAX_REQUESTS not set, using defaults in middleware');
    }
    
    // ==================== PRINT RESULTS ====================
    
    // Print warnings (yellow)
    if (warnings.length > 0) {
        console.log('\n Configuration Warnings:');
        warnings.forEach(warning => {
            console.log(`   - ${warning}`);
        });
    }
    
    // Print errors (red) dan EXIT jika ada
    if (errors.length > 0) {
        console.error('\n Environment Validation Failed:');
        errors.forEach(error => {
            console.error(`   - ${error}`);
        });
        console.error('\n Please check your .env file and ensure all required variables are set.');
        console.error('   See .env.example for reference.\n');
        
        // EXIT process dengan error code 1
        process.exit(1);
    }
    
    // Success message (green)
    console.log(' Environment validation passed\n');
}


module.exports = validateEnv;