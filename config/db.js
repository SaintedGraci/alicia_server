const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Test the connection immediately
db.getConnection()
    .then(() => console.log("💎 Database Connected!"))
    .catch((err) => console.log("❌ Database Connection Failed:", err));

module.exports = db;