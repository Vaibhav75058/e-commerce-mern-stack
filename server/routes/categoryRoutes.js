const express =
  require("express");

const router =
  express.Router();

const Category =
  require(
    "../models/category"
  );

const {

  getCategories,

  createCategory,

} = require(

  "../controllers/categoryController"

);

/* GET + CREATE */

router.route("/")

  .get(getCategories)

  .post(createCategory);

/* UPDATE CATEGORY */

router.put(

  "/:id",

  async (req, res) => {

    try {

      const category =
        await Category.findById(
          req.params.id
        );

      if (!category) {

        return res.status(404).json({

          message:
            "Category not found",

        });

      }

      category.name =

        req.body.name ||
        category.name;

      category.image =

        req.body.image ||
        category.image;

      const updatedCategory =

        await category.save();

      res.json(
        updatedCategory
      );

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  }

);

/* DELETE CATEGORY */

router.delete(

  "/:id",

  async (req, res) => {

    try {

      const category =
        await Category.findById(
          req.params.id
        );

      if (!category) {

        return res.status(404).json({

          message:
            "Category not found",

        });

      }

      await category.deleteOne();

      res.json({

        message:
          "Category deleted",

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  }

);

module.exports =
  router;