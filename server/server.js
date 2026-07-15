
// Load environment variables from .env file immediately on boot
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const costRoutes = require('./routes/costRoutes');
const snsRoutes = require('./routes/snsRoutes');

// Import Custom Error Handler Middleware
const errorHandler = require('./middleware/errorHandler');

// 1. Initialize Express Application
const app = express();

// 2. Connect to MongoDB database
// (This is designed to log a warning gracefully if MONGODB_URI is empty, allowing you to run offline)
connectDB();

// 3. Register Global Middlewares
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

// 4. Base Status Route
// Allows testing the health of the API from a standard browser or Postman
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ONLINE',
    message: 'Welcome to the AWS Expense Tracker backend sandbox API!',
    documentation: 'Refer to server/README.md for route mappings and request flows.'
  });
});

// 5. Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/cost', costRoutes);
app.use('/api/sns', snsRoutes);

// 6. Mount Global Fallback Error Handler Middleware
// Note: This must always be mounted AFTER routing is defined!
app.use(errorHandler);

// 7. Start listening on designated port
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`========================================================`);
  console.log(`🚀 AWS Expense Tracker API Server Started Successfully!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📂 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`========================================================`);
});
