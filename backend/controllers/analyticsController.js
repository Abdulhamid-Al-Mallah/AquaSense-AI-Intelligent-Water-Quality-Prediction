const WaterRecord = require('../models/WaterRecord');

/**
 * @desc    Get KPI Summary Analytics
 * @route   GET /api/analytics/summary
 * @access  Public / Protected
 */
const getSummary = async (req, res, next) => {
  try {
    const totalTests = await WaterRecord.countDocuments();

    if (totalTests === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalTests: 0,
          averageDrinkability: 0,
          criticalCount: 0,
          moderateCount: 0,
          safeCount: 0,
          latestRecord: null
        }
      });
    }

    // Aggregation for overall averages and risk status counts
    const statsAgg = await WaterRecord.aggregate([
      {
        $group: {
          _id: null,
          avgDrinkability: { $avg: '$drinkabilityScore' },
          criticalCount: {
            $sum: { $cond: [{ $eq: ['$riskStatus', 'Critical'] }, 1, 0] }
          },
          moderateCount: {
            $sum: { $cond: [{ $eq: ['$riskStatus', 'Moderate'] }, 1, 0] }
          },
          safeCount: {
            $sum: { $cond: [{ $eq: ['$riskStatus', 'Safe'] }, 1, 0] }
          }
        }
      }
    ]);

    const latestRecord = await WaterRecord.findOne()
      .sort({ timestamp: -1 })
      .populate('submittedBy', 'name email role');

    const summary = statsAgg[0] || {
      avgDrinkability: 0,
      criticalCount: 0,
      moderateCount: 0,
      safeCount: 0
    };

    return res.status(200).json({
      success: true,
      data: {
        totalTests,
        averageDrinkability: Number(summary.avgDrinkability.toFixed(2)),
        criticalCount: summary.criticalCount,
        moderateCount: summary.moderateCount,
        safeCount: summary.safeCount,
        latestRecord
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Time-Series Trends (Daily Aggregations for Recharts)
 * @route   GET /api/analytics/trends
 * @access  Public / Protected
 */
const getTrends = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - Number(days));

    const trends = await WaterRecord.aggregate([
      {
        $match: {
          timestamp: { $gte: dateLimit }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          date: {
            $first: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
          },
          avgDrinkability: { $avg: '$drinkabilityScore' },
          avgPh: { $avg: '$ph' },
          avgTurbidity: { $avg: '$turbidity' },
          avgDO: { $avg: '$do' },
          avgBOD: { $avg: '$bod' },
          avgLead: { $avg: '$lead' },
          avgMercury: { $avg: '$mercury' },
          avgArsenic: { $avg: '$arsenic' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 } // Chronological order
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          avgDrinkability: { $round: ['$avgDrinkability', 2] },
          avgPh: { $round: ['$avgPh', 2] },
          avgTurbidity: { $round: ['$avgTurbidity', 2] },
          avgDO: { $round: ['$avgDO', 2] },
          avgBOD: { $round: ['$avgBOD', 2] },
          avgLead: { $round: ['$avgLead', 4] },
          avgMercury: { $round: ['$avgMercury', 4] },
          avgArsenic: { $round: ['$avgArsenic', 4] },
          count: 1
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      count: trends.length,
      data: trends
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Aggregations by Location (for Bar / Breakdown Charts)
 * @route   GET /api/analytics/locations
 * @access  Public / Protected
 */
const getLocations = async (req, res, next) => {
  try {
    const locations = await WaterRecord.aggregate([
      {
        $group: {
          _id: '$location',
          location: { $first: '$location' },
          avgDrinkability: { $avg: '$drinkabilityScore' },
          totalTests: { $sum: 1 },
          criticalCount: {
            $sum: { $cond: [{ $eq: ['$riskStatus', 'Critical'] }, 1, 0] }
          },
          moderateCount: {
            $sum: { $cond: [{ $eq: ['$riskStatus', 'Moderate'] }, 1, 0] }
          },
          safeCount: {
            $sum: { $cond: [{ $eq: ['$riskStatus', 'Safe'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { totalTests: -1 }
      },
      {
        $project: {
          _id: 0,
          location: '$_id',
          avgDrinkability: { $round: ['$avgDrinkability', 2] },
          totalTests: 1,
          criticalCount: 1,
          moderateCount: 1,
          safeCount: 1
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getTrends,
  getLocations
};
