const express = require('express');
const router = express.Router();
const { getSuppliers, createSupplier, updateSupplier, deleteSupplier } = require('../controllers/supplierController');
const { protect } = require('../middleware/authMiddleware');
const { roleCheck } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, getSuppliers)
    .post(protect, roleCheck(['Admin', 'Manager']), createSupplier);

router.route('/:id')
    .put(protect, roleCheck(['Admin', 'Manager']), updateSupplier)
    .delete(protect, roleCheck(['Admin']), deleteSupplier);

module.exports = router;
