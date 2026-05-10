const pool = require('../config/database');
const bcrypt = require('bcryptjs');

// CREATE USER
const createUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error('Create user error:', err);

        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Username already exists' });
        }

        res.status(500).json({ error: err.message });
    }
};

// READ ALL USERS
const getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT user_id, username, created_at, updated_at FROM users'
        );

        res.status(200).json(rows);
    } catch (err) {
        console.error('Get users error:', err);
        res.status(500).json({ error: err.message });
    }
};

// READ ONE USER BY ID
const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(
            'SELECT user_id, username, created_at, updated_at FROM users WHERE user_id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Get user error:', err);
        res.status(500).json({ error: err.message });
    }
};

// UPDATE USER
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;

    try {
        if (!username && !password) {
            return res.status(400).json({ error: 'Username or password is required' });
        }

        let query = '';
        let values = [];

        if (username && password) {
            const hashedPassword = await bcrypt.hash(password, 10);

            query = 'UPDATE users SET username = ?, password = ? WHERE user_id = ?';
            values = [username, hashedPassword, id];
        } else if (username) {
            query = 'UPDATE users SET username = ? WHERE user_id = ?';
            values = [username, id];
        } else if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);

            query = 'UPDATE users SET password = ? WHERE user_id = ?';
            values = [hashedPassword, id];
        }

        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.error('Update user error:', err);

        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Username already exists' });
        }

        res.status(500).json({ error: err.message });
    }
};

// DELETE USER
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query(
            'DELETE FROM users WHERE user_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};