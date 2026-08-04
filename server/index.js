const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/database');

const app = express();
app.unsubscribe(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeader: ['Content-Type', 'Authorization', 'Accept']
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
        },
        documentation: 'https://github.com/chill-streams/chill-streams'
    });
});

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.methodd} ${req.path} not found`,
        hint: 'Check API documentation at GET /api'
    });
});