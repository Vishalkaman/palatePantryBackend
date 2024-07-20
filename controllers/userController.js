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

const getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const [user] = await db.execute('SELECT * FROM Users WHERE id = ?', [userId]);
        if (user.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserByUsername = async (req, res) => {
    const username = req.params.username;
    try {
        const [rows] = await db.execute('SELECT username, email, contactNumber FROM Users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const user = rows[0];
        res.status(200).json({
            username: user.username,
            email: user.email,
            contactNumber: user.contactNumber
        });
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
                res.json({
                    // token,
                    username: user.username,
                    email: user.email,
                    contactNumber: user.contactNumber
                });
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
    loginUser,
    getUserById,
    getUserByUsername
};

