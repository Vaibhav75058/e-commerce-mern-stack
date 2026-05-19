const express = require('express');

const router = express.Router();

const {

  createOrder,

  getMyOrders,

  getOrderById,

  getAllOrders,

  updateOrderToDelivered,

  updateOrderStatus,

} = require('../controllers/orderController');

const {

  protect,

  isAdmin,

} = require('../middleware/authMiddleware');

router
  .route('/')

  .post(
    protect,
    createOrder
  )

  .get(
    protect,
    isAdmin,
    getAllOrders
  );

router
  .route('/myorders')

  .get(
    protect,
    getMyOrders
  );

router
  .route('/:id')

  .get(
    protect,
    getOrderById
  );

router
  .route('/:id/deliver')

  .put(

    protect,

    isAdmin,

    updateOrderToDelivered

  );

/* REAL ORDER STATUS UPDATE */

router.put(

  '/:id/status',

  protect,

  isAdmin,

  updateOrderStatus

);

module.exports = router;