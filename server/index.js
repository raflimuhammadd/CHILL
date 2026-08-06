const express = require('express');
const cors = require('cors');
require ('dotenv').config();

const db = require('./config/database');
const { getGenreById } = require('./services/genreService');
const { getUserById } = require('./services/authService');

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
            register: 'POST /api/auth/',
            login: 'POST /api/auth/login',
            me: 'GET /api/auth/me',
            getUserById: 'GET /api/users/me',
            updateUser: 'PATCH /api/users/me'
        },
        documentation: 'https://github.com/raflimuhammadd/CHILL'
    });
});

// Routes
app.use('/api/genres', require('./routes/genreRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

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
app.listen(PORT, () => {
    console.log('');
    console.log('CHILL STREAMS API SERVER');
    console.log('===========================================');
    console.log(`Server running on port ${PORT}`);
    console.log(`Local: http://localhost:${PORT}`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
    console.log(`API Info: http://localhost:${PORT}/api`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`CORS Origin: ${process.env.CLIENT_URL}`);
    console.log('============================================');
    console.log('');
});

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