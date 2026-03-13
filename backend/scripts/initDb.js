const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const initDb = async () => {
    let connection;
    try {
        console.log('Connecting to MySQL...');
        // First connection without database to create it if it doesn't exist
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true
        });

        console.log(`Creating database ${process.env.DB_NAME} if it doesn't exist...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`);
        await connection.query(`USE ${process.env.DB_NAME};`);

        console.log('Reading schema.sql...');
        const schemaSql = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');
        console.log('Executing schema...');
        await connection.query(schemaSql);

        console.log('Reading seed.sql...');
        const seedSql = fs.readFileSync(path.join(__dirname, '../database/seed.sql'), 'utf8');
        console.log('Executing seed data...');
        await connection.query(seedSql);

        // Check if admin user already exists
        const [users] = await connection.query('SELECT * FROM users WHERE email = ?', ['admin@example.com']);
        if (users.length === 0) {
            console.log('Creating default admin user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            
            // Assume roles table has 'Admin' as ID 1 (based on seed.sql)
            await connection.query(
                'INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
                ['admin', 'admin@example.com', hashedPassword, 1]
            );
            console.log('Admin user created (admin@example.com / password123)');
        }

        console.log('Database initialized successfully!');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
};

initDb();
