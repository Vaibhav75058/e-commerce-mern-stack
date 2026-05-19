const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getCategories,
} = require('../controllers/productController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, isAdmin, createProduct);

router
  .route('/:id')
  .get(getProductById)
  .put(protect, isAdmin, updateProduct)
  .delete(protect, isAdmin, deleteProduct);

router.route('/:id/reviews').post(protect, createProductReview);
router.get(
  "/categories/all",
  getCategories
);
module.exports = router;