const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const connectDB = require('./config/db');

const chatRoutes = require("./routes/chatRoutes");

dotenv.config();

connectDB();

const app = express();


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(
  "/api/address",
  require(
    "./routes/addressRoutes"
  )
);
app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/products', require('./routes/productRoutes'));

app.use('/api/orders', require('./routes/orderRoutes'));

app.use('/api/users', require('./routes/userRoutes'));

app.use("/api/chat", chatRoutes);
app.use(
  "/api/wishlist",
  require(
    "./routes/wishlistRoutes"
  )
);
app.get('/', (req, res) => {
  res.send('ShopEase API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
const categoryRoutes =
  require(
    "./routes/categoryRoutes"
  );
  app.use(
  "/api/categories",
  categoryRoutes
);