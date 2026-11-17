import express from 'express';
import {
  predictWaterQuality,
  getHistory,
  deleteRecord
} from '../controllers/predictionController.js';
import {
  getSummary,
  getTrends,
  getLocations
} from '../controllers/analyticsController.js';

const router = express.Router();

// Prediction Routes
router.post('/predict', predictWaterQuality);

// History Routes
router.get('/history', getHistory);
router.delete('/history/:id', deleteRecord);

// Analytics & Aggregation Routes
router.get('/analytics/summary', getSummary);
router.get('/analytics/trends', getTrends);
router.get('/analytics/locations', getLocations);

export default router;
