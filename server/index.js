const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// MIDDLEWARE
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ROUTES
app.use('/api/auth',      require('./routes/authRoutes'));
app.use('/api/products',  require('./routes/productRoutes'));
app.use('/api/orders',    require('./routes/orderRoutes'));
app.use('/api/users',     require('./routes/userRoutes'));
app.use('/api/address',   require('./routes/addressRoutes'));
app.use('/api/wishlist',  require('./routes/wishlistRoutes'));
app.use('/api/categories',require('./routes/categoryRoutes'));
app.use('/api/chat',      require('./routes/chatRoutes'));

// ROOT
app.get('/', (req, res) => {
  res.send('ShopEase API is running...');
});

// SERVER START — SABSE LAST MEIN
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);