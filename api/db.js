const { Pool } = require('pg');
require('dotenv').config();
const { decryptObject } = require('./utils/encrypt');

// Set up a connection pool for PostgreSQL
const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: 5432, 
});

module.exports.defaultDb = pool;

function getDbFromHash(hash) {
    const data = decryptObject(hash);
    const db = new Pool(data);
    return db;
}

module.exports.getDbFromHash = getDbFromHash;