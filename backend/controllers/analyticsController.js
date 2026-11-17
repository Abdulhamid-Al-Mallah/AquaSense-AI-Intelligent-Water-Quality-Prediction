const WaterRecord = require('../models/WaterRecord');

/**
 * Returns overall statistical summary (KPIs) of all water quality samples tested.
 * Route: GET /api/analytics/summary
 */
const getSummary = async (request, response, next) => {
  try {
    const totalSamplesTested = await WaterRecord.countDocuments();

    // If database is empty, return a clean default summary
    if (totalSamplesTested === 0) {
      return response.status(200).json({
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

    // Calculate fleet-wide averages and status counts using MongoDB aggregation
    const statisticsAggregation = await WaterRecord.aggregate([
      {
        $group: {
          _id: null,
          averageDrinkability: { $avg: '$drinkabilityScore' },
          criticalCount: {
            $sum: {
              $cond: [{ $eq: ['$riskStatus', 'Critical'] }, 1, 0]
            }
          },
          moderateCount: {
            $sum: {
              $cond: [{ $eq: ['$riskStatus', 'Moderate'] }, 1, 0]
            }
          },
          safeCount: {
            $sum: {
              $cond: [{ $eq: ['$riskStatus', 'Safe'] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Find the single most recent water test record
    const latestTestRecord = await WaterRecord.findOne()
      .sort({ timestamp: -1 })
      .populate('submittedBy', 'name email role');

    const calculatedStats = statisticsAggregation[0] || {
      averageDrinkability: 0,
      criticalCount: 0,
      moderateCount: 0,
      safeCount: 0
    };

    return response.status(200).json({
      success: true,
      data: {
        totalTests: totalSamplesTested,
        averageDrinkability: Number(calculatedStats.averageDrinkability.toFixed(2)),
        criticalCount: calculatedStats.criticalCount,
        moderateCount: calculatedStats.moderateCount,
        safeCount: calculatedStats.safeCount,
        latestRecord: latestTestRecord
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Returns daily trend averages over time (tailored for time-series charts).
 * Route: GET /api/analytics/trends
 */
const getTrends = async (request, response, next) => {
  try {
    const numberOfDays = Number(request.query.days) || 30;
    const pastDateCutoff = new Date();
    pastDateCutoff.setDate(pastDateCutoff.getDate() - numberOfDays);

    const dailyTrends = await WaterRecord.aggregate([
      {
        $match: {
          timestamp: { $gte: pastDateCutoff }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          averageDrinkability: { $avg: '$drinkabilityScore' },
          averagePh: { $avg: '$ph' },
          averageTurbidity: { $avg: '$turbidity' },
          averageDissolvedOxygen: { $avg: '$do' },
          averageBiochemicalDemand: { $avg: '$bod' },
          averageLead: { $avg: '$lead' },
          averageMercury: { $avg: '$mercury' },
          averageArsenic: { $avg: '$arsenic' },
          samplesCount: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 } // Sort chronologically from oldest to newest
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          avgDrinkability: { $round: ['$averageDrinkability', 2] },
          avgPh: { $round: ['$averagePh', 2] },
          avgTurbidity: { $round: ['$averageTurbidity', 2] },
          avgDO: { $round: ['$averageDissolvedOxygen', 2] },
          avgBOD: { $round: ['$averageBiochemicalDemand', 2] },
          avgLead: { $round: ['$averageLead', 4] },
          avgMercury: { $round: ['$averageMercury', 4] },
          avgArsenic: { $round: ['$averageArsenic', 4] },
          count: '$samplesCount'
        }
      }
    ]);

    return response.status(200).json({
      success: true,
      count: dailyTrends.length,
      data: dailyTrends
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Returns breakdown statistics grouped by monitoring station/location (for bar charts).
 * Route: GET /api/analytics/locations
 */
const getLocations = async (request, response, next) => {
  try {
    const locationSummaries = await WaterRecord.aggregate([
      {
        $group: {
          _id: '$location',
          averageDrinkability: { $avg: '$drinkabilityScore' },
          totalTests: { $sum: 1 },
          criticalCount: {
            $sum: {
              $cond: [{ $eq: ['$riskStatus', 'Critical'] }, 1, 0]
            }
          },
          moderateCount: {
            $sum: {
              $cond: [{ $eq: ['$riskStatus', 'Moderate'] }, 1, 0]
            }
          },
          safeCount: {
            $sum: {
              $cond: [{ $eq: ['$riskStatus', 'Safe'] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { totalTests: -1 } // Highest volume stations first
      },
      {
        $project: {
          _id: 0,
          location: '$_id',
          avgDrinkability: { $round: ['$averageDrinkability', 2] },
          totalTests: 1,
          criticalCount: 1,
          moderateCount: 1,
          safeCount: 1
        }
      }
    ]);

    return response.status(200).json({
      success: true,
      count: locationSummaries.length,
      data: locationSummaries
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
