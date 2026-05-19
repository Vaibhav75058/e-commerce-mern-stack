const express =
  require("express");

const router =
  express.Router();

const {

  addAddress,

  getAddresses,

  deleteAddress,

  updateAddress,

} = require(
  "../controllers/addressController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

router
  .route("/")

  .post(
    protect,
    addAddress
  )

  .get(
    protect,
    getAddresses
  );

router
  .route("/:id")

  .delete(
    protect,
    deleteAddress
  )

  .put(
    protect,
    updateAddress
  );

module.exports =
  router;