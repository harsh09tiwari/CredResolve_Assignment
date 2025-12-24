import db from '../config/db.js';

export const createUser = async (req, res) => {
    const { name, email, mobile } = req.body;

    if (!name || !email || !mobile) {
        return res.status(400).json({ error: 'Name, Email, and Mobile are required' });
    }
    try {
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }
        const [result] = await db.query(
            'INSERT INTO users (name, email, mobile) VALUES (?, ?, ?)',
            [name, email, mobile]
        );
        res.status(201).json({
            message: 'User created successfully',
            userId: result.insertId,
            name,
            email
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, name, email FROM users');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};