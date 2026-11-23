import express from 'express';
import {
  predictWaterQuality,
  batchPredictWaterQuality,
  getHistory,
  deleteRecord
} from '../controllers/predictionController.js';
import {
  getSummary,
  getTrends,
  getLocations
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Prediction Routes (Protected via JWT Authentication Guard)
router.post('/predict', protect, predictWaterQuality);
router.post('/predict/batch', protect, batchPredictWaterQuality);

// History Routes (Protected)
router.get('/history', protect, getHistory);
router.delete('/history/:id', protect, deleteRecord);

// Analytics & Aggregation Routes (Protected)
router.get('/analytics/summary', protect, getSummary);
router.get('/analytics/trends', protect, getTrends);
router.get('/analytics/locations', protect, getLocations);

export default router;
