/**
 * Database Connection Pool Config
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    charset: 'utf8mb4',
    timezone: '+07:00',

    multipleStatements: false,
});

pool.getConnection()
    .then(connection => {
        console.log('Database connection established');
        console.log(`Database: ${process.env.DB_NAME}`);
        console.log(`Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
        connection.release();
    })
    .catch(err => {
        console.error('Database connection failed');
        console.error(`Error: ${err.message}`);
        console.error('Please check your database configuration in the .env file.');
    });

module.exports = pool;