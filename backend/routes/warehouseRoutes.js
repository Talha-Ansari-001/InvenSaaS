const express = require('express');
const router = express.Router();
const { getWarehouses } = require('../controllers/warehouseController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getWarehouses);

module.exports = router;
