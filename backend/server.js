const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const { seedAdmin } = require('./controllers/authController');

// Load environment variables from backend/.env or root fallback
dotenv.config({ path: path.join(__dirname, '.env') });

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB().then(() => {
  // Seed default admin for initial testing & development
  seedAdmin();
});

// Middlewares
app.use(cors());
// Support bulk JSON lab uploads up to 5MB
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AquaSense AI Backend API is online and operational',
    timestamp: new Date().toISOString()
  });
});

// API Routes
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Catch-all 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot find route: ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Server Listening
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[AquaSense AI] Backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[AquaSense AI] Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
