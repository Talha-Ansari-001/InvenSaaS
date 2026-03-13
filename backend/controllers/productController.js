const db = require('../config/db');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
    try {
        const [products] = await db.execute(`
            SELECT p.*, c.name as category_name, s.name as supplier_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            LEFT JOIN suppliers s ON p.supplier_id = s.id
        `);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Private
const getProductById = async (req, res) => {
    try {
        const [product] = await db.execute(`
            SELECT p.*, c.name as category_name, s.name as supplier_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            WHERE p.id = ?
        `, [req.params.id]);

        if (product.length > 0) {
            res.json(product[0]);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin/Manager
const createProduct = async (req, res) => {
    const { name, sku, description, price, category_id, supplier_id, image_url } = req.body;

    try {
        const [result] = await db.execute(
            'INSERT INTO products (name, sku, description, price, category_id, supplier_id, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                name, 
                sku, 
                description || null, 
                price, 
                category_id || null, 
                supplier_id || null, 
                image_url || null
            ]
        );
        const [newProduct] = await db.execute('SELECT * FROM products WHERE id = ?', [result.insertId]);
        res.status(201).json(newProduct[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin/Manager
const updateProduct = async (req, res) => {
    const { name, sku, description, price, category_id, supplier_id, image_url } = req.body;

    try {
        const [product] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);

        if (product.length > 0) {
            await db.execute(
                'UPDATE products SET name=?, sku=?, description=?, price=?, category_id=?, supplier_id=?, image_url=? WHERE id=?',
                [name, sku, description, price, category_id, supplier_id, image_url, req.params.id]
            );
            const [updatedProduct] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
            res.json(updatedProduct[0]);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const [product] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);

        if (product.length > 0) {
            await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
