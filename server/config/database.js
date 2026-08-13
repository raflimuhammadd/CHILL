/**
 * Database Connection Pool Config
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_POOL_LIMIT, 10) || 10,
    queueLimit: 0,

    charset: 'utf8mb4',
    timezone: '+07:00',

    multipleStatements: false,
};

if (process.env.DB_SSL === 'true') {
    const fs = require('fs');
    const path = require('path');

    poolConfig.ssl = {
        ca: fs.readFileSync(path.join(__dirname, '..', 'certs', 'aiven-ca.pem')),
        rejectUnauthorized: true
    };
}

const pool = mysql.createPool(poolConfig);

pool.getConnection()
    .then(connection => {
        console.log('Database connection established');
        console.log(`Database: ${process.env.DB_NAME}`);
        console.log(`Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
        console.log(`SSL: ${process.env.DB_SSL === 'true' ? 'enabled' : 'disabled'}`);
        connection.release();
    })
    .catch(err => {
        console.error('Database connection failed');
        console.error(`Error: ${err.message}`);
        console.error('Please check your database configuration in the .env file.');
    });

module.exports = pool;