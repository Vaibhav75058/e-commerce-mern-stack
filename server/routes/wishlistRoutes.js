const express =
  require("express");

const router =
  express.Router();

const {

  getWishlist,

  addToWishlist,

  removeWishlist,

} = require(
  "../controllers/wishlistController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

router
  .route("/")

  .get(
    protect,
    getWishlist
  )

  .post(
    protect,
    addToWishlist
  );

router
  .route("/:id")

  .delete(
    protect,
    removeWishlist
  );

module.exports =
  router;