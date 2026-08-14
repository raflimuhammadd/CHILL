const db = require('./config/database');
const express = require('express');
const cors = require('cors');
require ('dotenv').config();

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${req.method} ${req.path}`);
        next();
    });
}

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
        endpoints: {
            health: 'GET /api/health',
            genres: 'GET /api/genres',
            getGenreById: 'GET /api/genres/:id',
            createGenre: 'POST /api/genres',
            updateGenre: 'PATCH /api/genres/:id',
            deleteGenre: 'DELETE /api/genres/:id',
            register: 'POST /api/auth/register',
            login: 'POST /api/auth/login',
            verifyEmail: 'POST /api/auth/verify-email',
            getUserById: 'GET /api/users/me',
            updateUser: 'PATCH /api/users/me'
        },
        documentation: 'https://github.com/raflimuhammadd/CHILL'
    });
});

// Routes
app.use('/api/genres', require('./features/genre/genreRoutes'));
app.use('/api/auth', require('./features/auth/authRoutes'));
app.use('/api/contents', require('./features/content/contentRoutes'));
app.use('/api/users', require('./features/user/userRoutes'));
app.use('/api/watch-history', require('./features/watch-history/watchHistoryRoutes'));

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`,
        hint: 'Check API documentation at GET /api'
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    const statusCode = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error'

    res.status(statusCode).json({
        success: false,
        message: message,
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