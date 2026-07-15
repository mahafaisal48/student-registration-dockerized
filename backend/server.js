require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    db.ping((err) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Database not connected' });
        }
        res.json({ status: 'ok', message: 'Database connected' });
    });
});

app.get('/', (req, res) => {
    res.json({ message: 'Backend server is running!' });
});

app.post('/register', (req, res) => {
    const { studentName, email, studentId, department, phoneNumber } = req.body;
    
    if (!studentName || !email || !studentId || !department || !phoneNumber) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.ping((pingErr) => {
        if (pingErr) {
            console.error('Database connection lost:', pingErr);
            return res.status(500).json({ error: 'Database connection unavailable' });
        }

        const query = `
            INSERT INTO students (student_name, email, student_id, department, phone_number) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        db.query(query, [studentName, email, studentId, department, phoneNumber], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ 
                        error: 'Student ID or Email already exists' 
                    });
                }
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error: ' + err.message });
            }
            res.json({ 
                message: 'Student registered successfully!',
                studentId: result.insertId 
            });
        });
    });
});

app.get('/students', (req, res) => {
    db.ping((pingErr) => {
        if (pingErr) {
            console.error('Database connection lost:', pingErr);
            return res.status(500).json({ error: 'Database connection unavailable' });
        }

        const query = 'SELECT * FROM students ORDER BY created_at DESC';
        
        db.query(query, (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error: ' + err.message });
            }
            res.json({ students: results });
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});