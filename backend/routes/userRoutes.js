const express = require('express');
const router = express.Router();
const { getUsers, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { roleCheck } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, roleCheck(['Admin']), getUsers);

router.route('/:id')
    .delete(protect, roleCheck(['Admin']), deleteUser);

module.exports = router;
