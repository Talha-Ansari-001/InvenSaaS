const db = require('../config/db');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (user && (await bcrypt.compare(password, user.password_hash))) {
            const [roles] = await db.execute('SELECT name FROM roles WHERE id = ?', [user.role_id]);
            const role = roles[0] ? roles[0].name : 'Staff';

            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                role: role,
                token: generateToken(user.id, role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (or Admin only depending on requirements, making it Public for starter)
const registerUser = async (req, res) => {
    const { username, email, password, role_id } = req.body;

    try {
        const [userExists] = await db.execute('SELECT email FROM users WHERE email = ?', [email]);

        if (userExists.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Default to Staff (role_id 3) if not provided
        const role = role_id || 3;

        const [result] = await db.execute(
            'INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role]
        );

        if (result.insertId) {
            const [roles] = await db.execute('SELECT name FROM roles WHERE id = ?', [role]);
            const roleName = roles[0] ? roles[0].name : 'Staff';

            res.status(201).json({
                id: result.insertId,
                username,
                email,
                role: roleName,
                token: generateToken(result.insertId, roleName),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { loginUser, registerUser };
