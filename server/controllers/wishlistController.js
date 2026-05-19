const User =
  require("../models/User");

/* GET WISHLIST */

const getWishlist =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        ).populate("wishlist");

      res.json(
        user.wishlist
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

/* ADD */

const addToWishlist =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      const exists =
        user.wishlist.includes(
          req.body.productId
        );

      if (!exists) {

        user.wishlist.push(
          req.body.productId
        );

        await user.save();

      }

      res.json({
        message:
          "Added to wishlist",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

/* REMOVE */

const removeWishlist =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      user.wishlist =
        user.wishlist.filter(

          (item) =>

            item.toString()

            !==

            req.params.id

        );

      await user.save();

      res.json({
        message:
          "Removed",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

module.exports = {

  getWishlist,

  addToWishlist,

  removeWishlist,

};