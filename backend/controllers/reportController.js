const db = require('../config/db');

// @desc    Get dashboard stats
// @route   GET /api/reports/dashboard
// @access  Private/Admin/Manager
const getDashboardStats = async (req, res) => {
    try {
        // Product Count
        const [productResult] = await db.execute('SELECT COUNT(*) as count FROM products');
        const totalProducts = productResult[0].count || 0;

        // Low Stock Count
        const [lowStockResult] = await db.execute('SELECT COUNT(*) as count FROM inventory_levels WHERE quantity <= low_stock_threshold');
        const lowStockItems = lowStockResult[0].count || 0;

        // Recent Orders Count (e.g., in the last 30 days)
        const [ordersResult] = await db.execute('SELECT COUNT(*) as count FROM orders');
        const recentOrders = ordersResult[0].count || 0;

        // Total Users
        const [usersResult] = await db.execute('SELECT COUNT(*) as count FROM users');
        const totalUsers = usersResult[0].count || 0;

        res.json({
            totalProducts,
            lowStockItems,
            recentOrders,
            totalUsers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get stock by category
// @route   GET /api/reports/category-distribution
const getCategoryDistribution = async (req, res) => {
    try {
        const [result] = await db.execute(`
            SELECT c.name, COUNT(p.id) as value 
            FROM categories c 
            LEFT JOIN products p ON c.id = p.category_id 
            GROUP BY c.id
        `);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get monthly stock movements
// @route   GET /api/reports/monthly-movements
const getMonthlyMovements = async (req, res) => {
    try {
        const [result] = await db.execute(`
            SELECT 
                DATE_FORMAT(created_at, '%b') as month,
                SUM(CASE WHEN type = 'IN' THEN quantity ELSE 0 END) as stockIn,
                SUM(CASE WHEN type = 'OUT' THEN ABS(quantity) ELSE 0 END) as stockOut
            FROM stock_movements
            WHERE created_at > DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY month
            ORDER BY MIN(created_at)
        `);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getDashboardStats, 
    getCategoryDistribution, 
    getMonthlyMovements 
};
