const Category =
  require(
    "../models/category"
  );

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

      const alreadyExists =
        await Category.findOne({

          name: name.trim(),

        });

      if (alreadyExists) {

        return res.status(400).json({

          message:
            "Category already exists",

        });

      }

      const category =
        new Category({

          name:
            name.trim(),

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