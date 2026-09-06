const db = require('./config/database');
const express = require('express');
const cors = require('cors');
const path = require('path');
const { uploadAvatar } = require('./features/upload/uploadController');
require ('dotenv').config();
const cookieParser = require('cookie-parser');
const {generalLimiter} = require('./middleware/rateLimiter');

// Swagger configuration
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('./swagger/swaggerConfig');

const app = express();
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:5173',  // Vite dev server
            'http://localhost:3000',  // Alternative frontend server
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(cookieParser());
app.use(express.json());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${req.method} ${req.path}`);
        next();
    });
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// rate limiting
app.use(generalLimiter);

// Generate Swagger/OpenAPI spec
const specs = swaggerJsdoc(swaggerConfig);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Chill Streams API Documentation',
    swaggerOptions: {
        persistAuthorization: true,
        displayOperationId: true
    }
}));

// OpenAPI JSON
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
});

// health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Chill Streams API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

app.get('/api', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(404).json({
            success: false,
            message: 'Route GET /api not found',
            hint: 'Check API documentation at GET /api/health'
        });
    }
    res.json({
        name: 'Chill Streams API',
        version: '1.0.0',
        description: 'Backend API for Chill Streams application',
        documentation: 'http://localhost:3000/api-docs',
        endpoints: {
            health: 'GET /api/health',
            apiDocs: 'GET /api-docs',
            apiDocsJson: 'GET /api-docs.json',
            genres: 'GET /api/genres or /api/v1/genres',
            auth: 'POST /api/auth/login',
            contents: 'GET /api/contents or /api/v1/contents',
            users: 'GET /api/users/me or /api/v1/users/me',
            watchHistory: 'GET /api/watch-history or /api/v1/watch-history',
            payments: 'POST /api/payments or /api/v1/payments'
        }
    });
});

// Routes - Maintain backward compatibility with non-versioned paths
const genreRoutes = require('./features/genre/genreRoutes');
const authRoutes = require('./features/auth/authRoutes');
const contentRoutes = require('./features/content/contentRoutes');
const userRoutes = require('./features/user/userRoutes');
const watchHistoryRoutes = require('./features/watch-history/watchHistoryRoutes');
const uploadRoutes = require('./features/upload/uploadRoutes');
const paymentRoutes = require('./features/payment/paymentRoutes');

// Non-versioned routes (backward compatibility)
app.use('/api/genres', genreRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contents', contentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/watch-history', watchHistoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);

// Versioned routes (v1)
app.use('/api/v1/genres', genreRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/contents', contentRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/watch-history', watchHistoryRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/payments', paymentRoutes);

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`,
        hint: 'Check API documentation at GET /api'
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
            success: false, 
            message: 'File too large. Maximum 2MB allowed.' 
        });
    }
    
    if (err.message && err.message.includes('Only image files')) {
        return res.status(400).json({ 
            success: false, 
            message: err.message 
        });
    }
    
    const statusCode = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            details: err.details || null
        })
    });
});


const PORT = process.env.PORT || 3000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log('CHILL STREAMS API SERVER');
        console.log('-----------------------');
        console.log(`Server running on port ${PORT}`);
        console.log(`Local: http://localhost:${PORT}`);
        console.log(`Health: http://localhost:${PORT}/api/health`);
        console.log(`API Info: http://localhost:${PORT}/api`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
        console.log(`Database: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    });
}

module.exports = app;


process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    db.end().then(() => {
        console.log('Database pool closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n SIGINT received. Shutting down gracefully...');
    db.end().then(() => {
        console.log('Database pool closed');
        process.exit(0);
    });
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});