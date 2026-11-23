import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import errorHandler from './middleware/errorMiddleware.js';
import { seedAdmin } from './controllers/authController.js';
import authRoutes from './routes/authRoutes.js';
import apiRoutes from './routes/apiRoutes.js';

// Setup current directory path for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Initialize Express application
const application = express();

// Connect to MongoDB Database
connectDB().then(() => {
  // Seed demo account on startup if absent
  seedAdmin();
});

// Configure CORS policy (Restricted to authorized client origins)
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

application.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server) or from allowed list
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS Policy: Access denied from origin ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
application.use(express.json({ limit: '5mb' }));
application.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Health Check Endpoint
application.get('/api/health', (request, response) => {
  response.status(200).json({
    success: true,
    message: 'AquaSense AI Backend API is online and operational',
    timestamp: new Date().toISOString()
  });
});

// Mount modular API routes
application.use('/api/auth', authRoutes);
application.use('/api', apiRoutes);

// Catch-all 404 Route Handler
application.use('*', (request, response) => {
  response.status(404).json({
    success: false,
    error: `Cannot find route: ${request.originalUrl}`
  });
});

// Central Error Handling Middleware
application.use(errorHandler);

// Server Listening
const SERVER_PORT = process.env.PORT || 5000;
const serverInstance = application.listen(SERVER_PORT, () => {
  console.log(
    `[AquaSense AI] Backend running in ${process.env.NODE_ENV || 'development'} mode on port ${SERVER_PORT}`
  );
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (unhandledError) => {
  console.error(`[AquaSense AI] Unhandled Rejection: ${unhandledError.message}`);
  serverInstance.close(() => process.exit(1));
});

export default application;
