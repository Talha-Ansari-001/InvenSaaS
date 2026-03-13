const express = require('express');
const router = express.Router();
const { 
    getDashboardStats, 
    getCategoryDistribution, 
    getMonthlyMovements 
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { roleCheck } = require('../middleware/roleMiddleware');

router.get('/dashboard', protect, roleCheck(['Admin', 'Manager']), getDashboardStats);
router.get('/category-distribution', protect, roleCheck(['Admin', 'Manager']), getCategoryDistribution);
router.get('/monthly-movements', protect, roleCheck(['Admin', 'Manager']), getMonthlyMovements);

module.exports = router;
