require('dotenv').config();
const mysql = require('mysql2');

let connection;

function connectWithRetry() {
    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectTimeout: 60000,
        acquireTimeout: 60000,
        timeout: 60000,
        reconnect: true
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database, retrying in 5 seconds...', err.message);
            setTimeout(connectWithRetry, 5000);
            return;
        }
        console.log('Connected to MySQL database!');
        
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS students (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                student_id VARCHAR(50) NOT NULL UNIQUE,
                department VARCHAR(255) NOT NULL,
                phone_number VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        connection.query(createTableQuery, (err) => {
            if (err) console.error('Error creating table:', err);
            else console.log('Students table ready!');
        });
    });

    connection.on('error', (err) => {
        console.error('Database connection error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connectWithRetry();
        }
    });
}

connectWithRetry();

module.exports = connection;