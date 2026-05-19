const User =
  require("../models/User");

const addAddress =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      user.addresses.push(
        req.body
      );

      await user.save();

      res.json(
        user.addresses
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

const getAddresses =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      res.json(
        user.addresses
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

module.exports = {

  addAddress,

  getAddresses,

};