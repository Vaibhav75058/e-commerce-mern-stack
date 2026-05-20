const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    category: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Category",

      required: true,

    },
    categoryImage: {

      type: String,

      default: "",

    },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    originalPrice: {

      type: Number,

      default: 0,

    },

    discountPercent: {

      type: Number,

      default: 0,

    },

    offers: [

      {

        type: String,

      },

    ],

    deliveryDays: {

      type: String,

      default: "2-4 Days",

    },

    inStock: {

      type: Boolean,

      default: true,

    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);