const db = require('../config/db');

const getSuppliers = async (req, res) => {
    try {
        const [suppliers] = await db.execute('SELECT * FROM suppliers');
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createSupplier = async (req, res) => {
    const { name, logo_url, contact_person, email, phone, address } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO suppliers (name, logo_url, contact_person, email, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
            [name, logo_url || null, contact_person, email, phone, address]
        );
        const [newSupplier] = await db.execute('SELECT * FROM suppliers WHERE id = ?', [result.insertId]);
        res.status(201).json(newSupplier[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSupplier = async (req, res) => {
    const { name, logo_url, contact_person, email, phone, address } = req.body;
    try {
        await db.execute(
            'UPDATE suppliers SET name=?, logo_url=?, contact_person=?, email=?, phone=?, address=? WHERE id=?',
            [name, logo_url || null, contact_person, email, phone, address, req.params.id]
        );
        res.json({ message: 'Supplier updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSupplier = async (req, res) => {
    try {
        await db.execute('DELETE FROM suppliers WHERE id = ?', [req.params.id]);
        res.json({ message: 'Supplier removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getSuppliers, createSupplier, updateSupplier, deleteSupplier };
