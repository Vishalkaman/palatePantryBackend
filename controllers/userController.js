const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    const { username, password, email, contactNumber } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            'INSERT INTO Users (username, passwd, email, contactNumber) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, email, contactNumber]
        );
        res.status(201).json({ id: result.insertId, username, email, contactNumber });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT * FROM Users');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [users] = await db.execute('SELECT * FROM Users WHERE username = ?', [username]);
        if (users.length > 0) {
            const user = users[0];
            const match = await bcrypt.compare(password, user.passwd);
            if (match) {
                const token = jwt.sign({ id: user.id }, 'your_jwt_secret');
                res.json({ token });
            } else {
                res.status(400).json({ error: 'Invalid credentials' });
            }
        } else {
            res.status(400).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    loginUser
};

