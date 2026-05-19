const User =
  require("../models/User");

/* ADD ADDRESS */

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

/* GET ADDRESSES */

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

/* DELETE ADDRESS */

const deleteAddress =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      user.addresses =
        user.addresses.filter(

          (item) =>

            item._id.toString()

            !==

            req.params.id

        );

      await user.save();

      res.json({
        message:
          "Address Deleted",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

/* UPDATE ADDRESS */

const updateAddress =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      const address =
        user.addresses.id(
          req.params.id
        );

      if (!address) {

        return res.status(404).json({
          message:
            "Address not found",
        });

      }

      address.fullName =
        req.body.fullName;

      address.phone =
        req.body.phone;

      address.flat =
        req.body.flat;

      address.area =
        req.body.area;

      address.city =
        req.body.city;

      address.state =
        req.body.state;

      address.pincode =
        req.body.pincode;

      address.type =
        req.body.type;

      await user.save();

      res.json({
        message:
          "Address Updated",
      });

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

  deleteAddress,

  updateAddress,

};