const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const addFebData = async () => {
    let connection;
    try {
        console.log('Connecting to MySQL...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true
        });

        console.log('Adding new products and inventory...');
        const products = [
            ['Smartphone 128GB', 'SP-001', 'Latest smartphone model', 799.00, 700.00, 1, 1],
            ['Coffee Maker Deluxe', 'CM-002', 'Programmable coffee maker', 89.00, 50.00, 3, 1],
            ['Slim Fit Jeans', 'JN-003', 'Blue slim fit denim', 49.00, 20.00, 2, 2],
            ['Bluetooth Speaker', 'BS-004', 'Portable waterproof speaker', 59.00, 30.00, 1, 1],
            ['Electric Kettle', 'EK-005', 'Fast boiling electric kettle', 35.00, 15.00, 3, 1]
        ];

        const [users] = await connection.query('SELECT id FROM users LIMIT 1');
        const userId = users.length > 0 ? users[0].id : null;
        const [dbWarehouses] = await connection.query('SELECT id FROM warehouses');

        for (const p of products) {
            const [prodResult] = await connection.query(
                'INSERT IGNORE INTO products (name, sku, description, price, cost_price, category_id, supplier_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                p
            );
            
            if (prodResult.insertId > 0) {
                const productId = prodResult.insertId;
                // Add initial stock (IN movement)
                for (const w of dbWarehouses) {
                    const quantity = Math.floor(Math.random() * 100) + 50;
                    await connection.query(
                        'INSERT INTO inventory_levels (product_id, warehouse_id, quantity) VALUES (?, ?, ?)',
                        [productId, w.id, quantity]
                    );
                    await connection.query(
                        'INSERT INTO stock_movements (product_id, warehouse_id, type, quantity, reason, user_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
                        [productId, w.id, 'IN', quantity, 'Initial Stock', userId, '2026-01-15 09:00:00']
                    );
                }
            }
        }

        const [dbProducts] = await connection.query('SELECT id FROM products');

        console.log('Adding orders and stock outflows for February 2026...');
        const febOrders = [
            { customer: 'Alice Johnson', date: '2026-02-05 10:30:00' },
            { customer: 'Bob Smith', date: '2026-02-12 14:15:00' },
            { customer: 'Charlie Brown', date: '2026-02-18 09:45:00' },
            { customer: 'Diana Prince', date: '2026-02-22 16:20:00' },
            { customer: 'Ethan Hunt', date: '2026-02-25 11:00:00' },
            { customer: 'Fiona Gallagher', date: '2026-02-27 13:30:00' }
        ];

        for (const orderInfo of febOrders) {
            const [orderResult] = await connection.query(
                'INSERT INTO orders (customer_name, status, user_id, created_at) VALUES (?, ?, ?, ?)',
                [orderInfo.customer, 'COMPLETED', userId, orderInfo.date]
            );
            const orderId = orderResult.insertId;

            // Add 1-3 random products to each order
            const numItems = Math.floor(Math.random() * 3) + 1;
            let totalAmount = 0;

            for (let i = 0; i < numItems; i++) {
                const randomProduct = dbProducts[Math.floor(Math.random() * dbProducts.length)];
                const [productData] = await connection.query('SELECT price FROM products WHERE id = ?', [randomProduct.id]);
                const price = productData[0].price;
                const quantity = Math.floor(Math.random() * 3) + 1;

                await connection.query(
                    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, randomProduct.id, quantity, price]
                );
                
                // Record Stock Outflow
                await connection.query(
                    'INSERT INTO stock_movements (product_id, warehouse_id, type, quantity, reason, user_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [randomProduct.id, dbWarehouses[0].id, 'OUT', quantity, `Order #${orderId}`, userId, orderInfo.date]
                );

                totalAmount += price * quantity;
            }

            await connection.query('UPDATE orders SET total_amount = ? WHERE id = ?', [totalAmount, orderId]);
        }

        console.log('Data added successfully!');
    } catch (error) {
        console.error('Error adding data:', error);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
};

addFebData();
