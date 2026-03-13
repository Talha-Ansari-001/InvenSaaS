const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { roleCheck } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, getProducts)
    .post(protect, roleCheck(['Admin', 'Manager']), createProduct);

router.route('/:id')
    .get(protect, getProductById)
    .put(protect, roleCheck(['Admin', 'Manager']), updateProduct)
    .delete(protect, roleCheck(['Admin']), deleteProduct);

module.exports = router;
