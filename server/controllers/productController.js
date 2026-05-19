const Product = require('../models/product');

/**
 * @desc    Fetch all products (Includes keyword search and category filtering)
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    // Construct search query for product name using Regex (case-insensitive)
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    // Construct category filter
    const category = req.query.category ? { category: req.query.category } : {};

    // Fetch products combining both filters
    const products = await Product.find({ ...keyword, ...category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Fetch a single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
  try {
    // Destructure all required fields to avoid ReferenceError
    const { 
      name, description, price, category, image, brand, stock, 
      originalPrice, discountPercent, offers, deliveryDays, inStock,
      rating, numReviews 
    } = req.body;

    const product = new Product({
      user: req.user._id,
      name,
      description,
      price,
      category,
      image,
      brand,
      stock,
      originalPrice,
      discountPercent,
      offers,
      deliveryDays,
      inStock,
      rating,       // Admin override permitted
      numReviews    // Admin override permitted
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update an existing product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
  try {
    const {
      name, description, price, category, image, brand, stock,
      originalPrice, discountPercent, offers, deliveryDays, inStock,
      rating, numReviews
    } = req.body;

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update String/Array values (Using || for falsy string values)
    product.name = name || product.name;
    product.description = description || product.description;
    product.category = category || product.category;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.offers = offers || product.offers;
    product.deliveryDays = deliveryDays || product.deliveryDays;
    
    // Update Number/Boolean values (Using Nullish Coalescing ?? to allow 0 or false)
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;
    product.originalPrice = originalPrice ?? product.originalPrice;
    product.discountPercent = discountPercent ?? product.discountPercent;
    product.inStock = inStock ?? product.inStock;
    
    // Admin rating overrides
    product.rating = rating ?? product.rating;
    product.numReviews = numReviews ?? product.numReviews;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create new review for a product
 * @route   POST /api/products/:id/reviews
 * @access  Private
 */
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the user has already reviewed this product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    // Construct the new review object
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    
    // Update total number of reviews
    product.numReviews = product.reviews.length;
    
    // Calculate and update average product rating
    product.rating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all distinct product categories
 * @route   GET /api/products/categories
 * @access  Public
 */
const getCategories = async (req, res) => {
  try {
    // Fetch unique categories directly from the DB
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getCategories,
};