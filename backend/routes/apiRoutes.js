const express = require('express');
const router = express.Router();
const {
  predictWaterQuality,
  getHistory,
  deleteRecord
} = require('../controllers/predictionController');
const {
  getSummary,
  getTrends,
  getLocations
} = require('../controllers/analyticsController');

// Prediction Routes
router.post('/predict', predictWaterQuality);

// History Routes
router.get('/history', getHistory);
router.delete('/history/:id', deleteRecord);

// Analytics & Aggregations
router.get('/analytics/summary', getSummary);
router.get('/analytics/trends', getTrends);
router.get('/analytics/locations', getLocations);

module.exports = router;
