const jwt = require('jsonwebtoken');
const db = require('../config/db');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const [rows] = await db.execute(
                'SELECT id, username, email, role_id FROM users WHERE id = ?',
                [decoded.id]
            );

            if (rows.length === 0) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            req.user = rows[0];
            
            // Fetch role name for convenience
            const [roleRows] = await db.execute('SELECT name FROM roles WHERE id = ?', [req.user.role_id]);
            if (roleRows.length > 0) {
                req.user.role = roleRows[0].name;
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
