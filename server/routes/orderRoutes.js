const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderToDelivered,
} = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createOrder).get(protect, isAdmin, getAllOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/deliver').put(protect, isAdmin, updateOrderToDelivered);

module.exports = router;