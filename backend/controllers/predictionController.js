const { spawn } = require('child_process');
const path = require('path');
const WaterRecord = require('../models/WaterRecord');
const { analyzeParameters } = require('../utils/waterAdvisor');

/**
 * Validate physical bounds of the 8 parameters
 * @param {Object} item - Laboratory reading
 * @returns {Object} normalized numbers
 */
function validateAndNormalizeParams(item) {
  // Support both lowercase/camelCase and original title format
  const ph = Number(item.ph !== undefined ? item.ph : item.pH);
  const turbidity = Number(
    item.turbidity !== undefined ? item.turbidity : (item['Turbidity (NTU)'] !== undefined ? item['Turbidity (NTU)'] : item.Turbidity)
  );
  const temperature = Number(
    item.temperature !== undefined ? item.temperature : (item['Temperature (°C)'] !== undefined ? item['Temperature (°C)'] : item.Temperature)
  );
  const doVal = Number(
    item.do !== undefined ? item.do : (item['DO (mg/L)'] !== undefined ? item['DO (mg/L)'] : item.DO)
  );
  const bod = Number(
    item.bod !== undefined ? item.bod : (item['BOD (mg/L)'] !== undefined ? item['BOD (mg/L)'] : item.BOD)
  );
  const lead = Number(
    item.lead !== undefined ? item.lead : (item['Lead (mg/L)'] !== undefined ? item['Lead (mg/L)'] : item.Lead)
  );
  const mercury = Number(
    item.mercury !== undefined ? item.mercury : (item['Mercury (mg/L)'] !== undefined ? item['Mercury (mg/L)'] : item.Mercury)
  );
  const arsenic = Number(
    item.arsenic !== undefined ? item.arsenic : (item['Arsenic (mg/L)'] !== undefined ? item['Arsenic (mg/L)'] : item.Arsenic)
  );

  const numChecks = [
    { name: 'ph', val: ph },
    { name: 'turbidity', val: turbidity },
    { name: 'temperature', val: temperature },
    { name: 'do', val: doVal },
    { name: 'bod', val: bod },
    { name: 'lead', val: lead },
    { name: 'mercury', val: mercury },
    { name: 'arsenic', val: arsenic }
  ];

  for (const c of numChecks) {
    if (isNaN(c.val)) {
      throw new Error(`Invalid value for parameter '${c.name}': Must be a valid number`);
    }
  }

  // Physical bounds validation
  if (ph < 0 || ph > 14) {
    throw new Error(`pH value (${ph}) is outside physically plausible range (0.0 to 14.0)`);
  }
  if (turbidity < 0) throw new Error(`Turbidity (${turbidity}) cannot be negative`);
  if (doVal < 0) throw new Error(`Dissolved Oxygen (${doVal}) cannot be negative`);
  if (bod < 0) throw new Error(`BOD (${bod}) cannot be negative`);
  if (lead < 0) throw new Error(`Lead (${lead}) cannot be negative`);
  if (mercury < 0) throw new Error(`Mercury (${mercury}) cannot be negative`);
  if (arsenic < 0) throw new Error(`Arsenic (${arsenic}) cannot be negative`);

  return {
    ph,
    turbidity,
    temperature,
    do: doVal,
    bod,
    lead,
    mercury,
    arsenic,
    location: item.location || 'Main Lab',
    timestamp: item.timestamp ? new Date(item.timestamp) : new Date()
  };
}

/**
 * Execute Python inference script via child_process.spawn
 * @param {Object} normalizedParams 
 * @returns {Promise<Object>} ML prediction result
 */
function runPythonInference(normalizedParams) {
  return new Promise((resolve, reject) => {
    // Prefer explicitly configured PYTHON_PATH; fallback to known user Python or generic 'python'
    const fallbackUserPython = path.join(
      process.env.LOCALAPPDATA || '',
      'Programs',
      'Python',
      'Python312',
      'python.exe'
    );
    const fs = require('fs');
    let pythonExe = process.env.PYTHON_PATH;
    if (!pythonExe || !fs.existsSync(pythonExe)) {
      if (fs.existsSync(fallbackUserPython)) {
        pythonExe = fallbackUserPython;
      } else {
        pythonExe = 'python';
      }
    }
    const scriptPath = path.resolve(__dirname, '..', 'ml-predict', 'predict.py');

    // Prepare JSON payload strictly for predict.py
    const payload = JSON.stringify({
      pH: normalizedParams.ph,
      Turbidity: normalizedParams.turbidity,
      Temperature: normalizedParams.temperature,
      DO: normalizedParams.do,
      BOD: normalizedParams.bod,
      Lead: normalizedParams.lead,
      Mercury: normalizedParams.mercury,
      Arsenic: normalizedParams.arsenic
    });

    const pythonProcess = spawn(pythonExe, [scriptPath, payload]);

    let stdoutData = '';
    let stderrData = '';

    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return reject(
          new Error(`Python inference exited with code ${code}: ${stderrData || stdoutData}`)
        );
      }

      try {
        const trimmed = stdoutData.trim();
        // Extract JSON strictly from first '{' to last '}' to handle nested objects cleanly
        const jsonStart = trimmed.indexOf('{');
        const jsonEnd = trimmed.lastIndexOf('}');
        if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
          return reject(new Error(`Failed to locate JSON output in Python stdout: ${stdoutData}`));
        }
        const jsonStr = trimmed.substring(jsonStart, jsonEnd + 1);
        const result = JSON.parse(jsonStr);

        if (!result.success) {
          return reject(new Error(result.error || 'Python inference failed'));
        }
        resolve(result);
      } catch (err) {
        reject(new Error(`Failed to parse ML inference JSON response: ${err.message}. Raw output: ${stdoutData}`));
      }
    });

    pythonProcess.on('error', (err) => {
      reject(new Error(`Failed to spawn Python process (${pythonExe}): ${err.message}`));
    });
  });
}

/**
 * @desc    Predict Water Quality (Single form entry or Bulk array)
 * @route   POST /api/predict
 * @access  Public / Protected
 */
const predictWaterQuality = async (req, res, next) => {
  try {
    const rawPayload = req.body;
    const isArray = Array.isArray(rawPayload);
    const items = isArray ? rawPayload : [rawPayload];

    if (!items.length) {
      return res.status(400).json({
        success: false,
        error: 'Empty request body. Please provide water quality parameters.'
      });
    }

    const processedRecords = [];

    for (const rawItem of items) {
      // 1. Validate & normalize inputs
      const normalized = validateAndNormalizeParams(rawItem);

      // 2. Invoke ML inference via Python IPC
      const mlOutput = await runPythonInference(normalized);

      // 3. Enrich with Regulatory & Decision-Support Advice
      const advice = analyzeParameters(normalized, mlOutput.drinkabilityScore);

      // 4. Construct MongoDB document
      const recordDoc = {
        ph: normalized.ph,
        turbidity: normalized.turbidity,
        temperature: normalized.temperature,
        do: normalized.do,
        bod: normalized.bod,
        lead: normalized.lead,
        mercury: normalized.mercury,
        arsenic: normalized.arsenic,
        location: normalized.location,
        timestamp: normalized.timestamp,
        submittedBy: req.user ? req.user._id : (rawItem.submittedBy || null),
        drinkabilityScore: mlOutput.drinkabilityScore,
        predictedClass: mlOutput.predictedClass,
        riskStatus: advice.riskStatus,
        warnings: advice.warnings,
        recommendations: advice.recommendations
      };

      processedRecords.push(recordDoc);
    }

    // Insert into MongoDB
    const savedRecords = await WaterRecord.insertMany(processedRecords);

    return res.status(201).json({
      success: true,
      count: savedRecords.length,
      data: isArray ? savedRecords : savedRecords[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Water Records History with Filters
 * @route   GET /api/history
 * @access  Public / Protected
 */
const getHistory = async (req, res, next) => {
  try {
    const { location, riskStatus, startDate, endDate, limit = 100, page = 1 } = req.query;

    const query = {};

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (riskStatus) {
      query.riskStatus = riskStatus;
    }

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await WaterRecord.countDocuments(query);
    const records = await WaterRecord.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('submittedBy', 'name email role');

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      count: records.length,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a specific record by ID
 * @route   DELETE /api/history/:id
 * @access  Public / Protected
 */
const deleteRecord = async (req, res, next) => {
  try {
    const record = await WaterRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        error: `Water record not found with id ${req.params.id}`
      });
    }

    await record.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Water record deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  predictWaterQuality,
  getHistory,
  deleteRecord
};
