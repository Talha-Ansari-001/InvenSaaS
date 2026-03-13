const express = require('express');
const router = express.Router();
const { getInventory, adjustStock } = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');
const { roleCheck } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, getInventory);

router.route('/adjust')
    .post(protect, roleCheck(['Admin', 'Manager']), adjustStock);

module.exports = router;
