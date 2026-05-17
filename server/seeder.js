const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/product');
const User = require('./models/User');

dotenv.config();

const products = [
  {
    name: 'iPhone 15 Pro',
    description: 'Apple iPhone 15 Pro with A17 Pro chip, 48MP camera system, and titanium design. Experience the most powerful iPhone ever made.',
    price: 134900,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
    brand: 'Apple',
    stock: 15,
    rating: 4.8,
    numReviews: 124,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Samsung Galaxy S24 Ultra with Snapdragon 8 Gen 3, 200MP camera, and built-in S Pen. The ultimate Android experience.',
    price: 129999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1706439136193-7d98cc8e3d12?w=500',
    brand: 'Samsung',
    stock: 20,
    rating: 4.7,
    numReviews: 98,
  },
  {
    name: 'MacBook Air M3',
    description: 'Apple MacBook Air with M3 chip, 13.6-inch Liquid Retina display, 18-hour battery life. Supercharged by M3.',
    price: 114900,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    brand: 'Apple',
    stock: 10,
    rating: 4.9,
    numReviews: 87,
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling headphones with 30-hour battery, crystal clear hands-free calling.',
    price: 29990,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500',
    brand: 'Sony',
    stock: 30,
    rating: 4.6,
    numReviews: 215,
  },
  {
    name: 'Nike Air Max 270',
    description: 'Nike Air Max 270 running shoes with large Air unit for all-day comfort. Lightweight and stylish design.',
    price: 12995,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    brand: 'Nike',
    stock: 50,
    rating: 4.5,
    numReviews: 312,
  },
  {
    name: 'Levi\'s 511 Slim Jeans',
    description: 'Classic Levi\'s 511 slim fit jeans in premium stretch denim. Perfect for everyday casual wear.',
    price: 3999,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
    brand: 'Levis',
    stock: 75,
    rating: 4.3,
    numReviews: 178,
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'Adidas Ultraboost 22 with responsive BOOST midsole and Primeknit upper for ultimate running comfort.',
    price: 14999,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500',
    brand: 'Adidas',
    stock: 40,
    rating: 4.4,
    numReviews: 143,
  },
  {
    name: 'Instant Pot Duo 7-in-1',
    description: 'Instant Pot Duo 7-in-1 electric pressure cooker. Pressure cook, slow cook, rice cooker, steamer, saute, yogurt maker.',
    price: 8999,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
    brand: 'Instant Pot',
    stock: 25,
    rating: 4.7,
    numReviews: 432,
  },
  {
    name: 'Dyson V15 Detect Vacuum',
    description: 'Dyson V15 Detect cordless vacuum with laser dust detection and powerful suction. Deep cleans your home effortlessly.',
    price: 52900,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    brand: 'Dyson',
    stock: 12,
    rating: 4.8,
    numReviews: 89,
  },
  {
    name: 'IKEA MALM Bed Frame',
    description: 'IKEA MALM bed frame in white with clean lines and modern design. Includes 4 storage boxes underneath.',
    price: 24999,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
    brand: 'IKEA',
    stock: 8,
    rating: 4.2,
    numReviews: 67,
  },
  {
    name: 'OnePlus 12',
    description: 'OnePlus 12 with Snapdragon 8 Gen 3, Hasselblad camera, 100W SUPERVOOC charging. Never Settle.',
    price: 64999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500',
    brand: 'OnePlus',
    stock: 22,
    rating: 4.5,
    numReviews: 156,
  },
  {
    name: 'boAt Rockerz 450',
    description: 'boAt Rockerz 450 wireless headphones with 15 hours battery, 40mm drivers, and foldable design.',
    price: 1499,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    brand: 'boAt',
    stock: 100,
    rating: 4.1,
    numReviews: 892,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const adminUser = await User.findOne({ isAdmin: true });
    if (!adminUser) {
      console.log('No admin user found! Register first.');
      process.exit(1);
    }

    await Product.deleteMany({});
    console.log('Old products deleted');

    const productsWithUser = products.map((p) => ({ ...p, user: adminUser._id }));
    await Product.insertMany(productsWithUser);

    console.log(`✅ ${products.length} Products added successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedProducts();