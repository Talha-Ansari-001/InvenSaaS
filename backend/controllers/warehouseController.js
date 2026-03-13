const db = require('../config/db');

// @desc    Get all warehouses
// @route   GET /api/warehouses
// @access  Private
const getWarehouses = async (req, res) => {
    try {
        const [warehouses] = await db.execute('SELECT * FROM warehouses');
        res.json(warehouses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getWarehouses };
