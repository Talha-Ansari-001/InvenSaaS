const db = require('../config/db');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    const { customer_name, order_items, warehouse_id } = req.body; 
    // order_items: [{ product_id, quantity, price }]
    
    if (!order_items || order_items.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    // Default to main warehouse if not specified (ID 1)
    const whId = warehouse_id || 1;

    try {
        // Calculate total
        const total_amount = order_items.reduce((acc, item) => acc + item.quantity * item.price, 0);

        // 1. Create Order
        const [orderResult] = await db.execute(
            'INSERT INTO orders (customer_name, total_amount, user_id, status) VALUES (?, ?, ?, ?)',
            [customer_name, total_amount, req.user.id, 'COMPLETED'] // Auto-complete for now to trigger stock movement immediately
        );
        const orderId = orderResult.insertId;

        // 2. Create Order Items & Update Stock
        for (const item of order_items) {
            await db.execute(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price]
            );

            // Update Stock
            // Check stock first
            const [stock] = await db.execute(
                'SELECT quantity FROM inventory_levels WHERE product_id = ? AND warehouse_id = ?',
                [item.product_id, whId]
            );

            let currentQty = stock.length > 0 ? stock[0].quantity : 0;
            let newQty = currentQty - item.quantity;

            if (stock.length > 0) {
                 await db.execute(
                    'UPDATE inventory_levels SET quantity = ? WHERE product_id = ? AND warehouse_id = ?',
                    [newQty, item.product_id, whId]
                );
            } else {
                 // Should not happen if validating stock, but handled just in case
                 await db.execute(
                    'INSERT INTO inventory_levels (product_id, warehouse_id, quantity) VALUES (?, ?, ?)',
                    [item.product_id, whId, -item.quantity]
                 );
            }

            // Log Movement
            await db.execute(
                'INSERT INTO stock_movements (product_id, warehouse_id, type, quantity, reason, user_id) VALUES (?, ?, ?, ?, ?, ?)',
                [item.product_id, whId, 'OUT', item.quantity, `Order #${orderId}`, req.user.id]
            );
        }

        const [createdOrder] = await db.execute('SELECT * FROM orders WHERE id = ?', [orderId]);
        res.status(201).json(createdOrder[0]);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
    try {
        const [orders] = await db.execute(`
            SELECT o.*, u.username as created_by 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            ORDER BY o.created_at DESC
        `);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const [orders] = await db.execute(`
            SELECT o.*, u.username as created_by 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            WHERE o.id = ?
        `, [req.params.id]);

        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = orders[0];

        const [items] = await db.execute(`
            SELECT oi.*, p.name as product_name, p.sku 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = ?
        `, [req.params.id]);

        order.items = items;
        res.json(order);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, getOrders, getOrderById };
