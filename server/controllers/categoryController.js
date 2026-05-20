const Category =
  require("../models/category");

const getCategories =
  async (req, res) => {

    try {

      const categories =
        await Category.find();

      res.json(categories);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

const createCategory =
  async (req, res) => {

    try {

      const {
        name,
        image,
      } = req.body;

      const category =
        new Category({

          name,

          image,

        });

      const saved =
        await category.save();

      res.status(201).json(
        saved
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

module.exports = {

  getCategories,

  createCategory,

};