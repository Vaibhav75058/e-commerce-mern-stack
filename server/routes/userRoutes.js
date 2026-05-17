const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getUserById,
} = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/').get(protect, isAdmin, getAllUsers);
router.route('/:id').get(protect, isAdmin, getUserById).delete(protect, isAdmin, deleteUser);

module.exports = router;