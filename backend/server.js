const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'users.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read users database file
const readUsers = () => {
    try {
        if (!fs.existsSync(DB_FILE)) {
            fs.writeFileSync(DB_FILE, JSON.stringify([]));
            return [];
        }
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data || '[]');
    } catch (err) {
        console.error('Error reading database file:', err);
        return [];
    }
};

// Helper function to write users database file
const writeUsers = (users) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
    } catch (err) {
        console.error('Error writing to database file:', err);
    }
};

// Root Health Check Route
app.get('/', (req, res) => {
    res.json({ message: 'Rakeshkumar Jewellers Backend API is running successfully!' });
});

// Signup Route
app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields (name, email, password) are required.' });
    }

    const users = readUsers();
    
    // Check if email already registered
    const formattedEmail = email.trim().toLowerCase();
    if (users.some(user => user.email === formattedEmail)) {
        return res.status(400).json({ error: 'An account with this email is already registered.' });
    }

    const newUser = {
        name: name.trim(),
        email: formattedEmail,
        password: password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsers(users);

    res.status(201).json({
        message: 'Account created successfully!',
        user: { name: newUser.name, email: newUser.email }
    });
});

// Login Route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const users = readUsers();
    const formattedEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email === formattedEmail && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.json({
        message: 'Login successful!',
        user: { name: user.name, email: user.email }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
