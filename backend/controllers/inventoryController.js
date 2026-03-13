const db = require('../config/db');

// @desc    Fetch inventory levels
// @route   GET /api/inventory
// @access  Private
const getInventory = async (req, res) => {
    try {
        const [inventory] = await db.execute(`
            SELECT i.*, p.name as product_name, p.sku, w.name as warehouse_name 
            FROM inventory_levels i 
            JOIN products p ON i.product_id = p.id 
            JOIN warehouses w ON i.warehouse_id = w.id
        `);
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Adjust stock
// @route   POST /api/inventory/adjust
// @access  Private/Manager/Admin
const adjustStock = async (req, res) => {
    const { product_id, warehouse_id, adjustment, type, reason } = req.body;
    // adjustment is the quantity to add/subtract (can be negative for reduction, but type should clarify)
    // Actually, usually 'quantity' is passed and 'type' defines the sign.
    // Let's assume 'quantity' is always positive and 'type' (IN/OUT/ADJUSTMENT) determines logic.

    const quantity = Math.abs(req.body.quantity); // Ensure positive

    try {
        // Start transaction (simplified, just sequential queries for now)
        // Check current stock
        const [rows] = await db.execute(
            'SELECT quantity FROM inventory_levels WHERE product_id = ? AND warehouse_id = ?',
            [product_id, warehouse_id]
        );

        let currentQty = 0;
        let exists = false;

        if (rows.length > 0) {
            currentQty = rows[0].quantity;
            exists = true;
        }

        let newQty = currentQty;
        if (type === 'IN' || type === 'PURCHASE') {
            newQty += quantity;
        } else if (type === 'OUT' || type === 'SALE') {
            newQty -= quantity;
        } else if (type === 'ADJUSTMENT') {
            // For adjustment, we might be setting absolute value or diff.
            // Let's assume adjustment adds/subtracts based on signed quantity passed?
            // Or let's just use IN/OUT logic. If type is ADJUSTMENT, allow signed quantity?
            // To be safe, let's stick to IN adds, OUT subtracts.
            // If user passes 'ADJUSTMENT', we need to know direction.
            // Let's assume the frontend passes signed integer for adjustment if type is 'ADJUSTMENT'.
            newQty += parseInt(req.body.quantity); 
        }

        if (newQty < 0) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        if (exists) {
            await db.execute(
                'UPDATE inventory_levels SET quantity = ? WHERE product_id = ? AND warehouse_id = ?',
                [newQty, product_id, warehouse_id]
            );
        } else {
            await db.execute(
                'INSERT INTO inventory_levels (product_id, warehouse_id, quantity) VALUES (?, ?, ?)',
                [product_id, warehouse_id, newQty]
            );
        }

        // Log movement
        await db.execute(
            'INSERT INTO stock_movements (product_id, warehouse_id, type, quantity, reason, user_id) VALUES (?, ?, ?, ?, ?, ?)',
            [product_id, warehouse_id, type, req.body.quantity, reason, req.user.id]
        );

        res.json({ message: 'Stock updated', newQuantity: newQty });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getInventory, adjustStock };
