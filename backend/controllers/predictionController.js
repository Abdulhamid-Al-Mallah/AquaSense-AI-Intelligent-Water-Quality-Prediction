const childProcess = require('child_process');
const path = require('path');
const fileSystem = require('fs');
const WaterRecord = require('../models/WaterRecord');
const { analyzeParameters } = require('../utils/waterAdvisor');

/**
 * Validates and standardizes water quality lab parameters entered by users.
 * Ensures all numbers are non-negative and within realistic physical ranges.
 * 
 * @param {Object} inputData - Raw water reading submitted from client
 * @returns {Object} Cleaned, validated numbers and metadata
 */
function validateAndCleanWaterParameters(inputData) {
  // Extract values, supporting either standard shorthand or full chemical labels
  const ph = Number(inputData.ph !== undefined ? inputData.ph : inputData.pH);
  const turbidity = Number(
    inputData.turbidity !== undefined
      ? inputData.turbidity
      : (inputData['Turbidity (NTU)'] !== undefined ? inputData['Turbidity (NTU)'] : inputData.Turbidity)
  );
  const temperature = Number(
    inputData.temperature !== undefined
      ? inputData.temperature
      : (inputData['Temperature (°C)'] !== undefined ? inputData['Temperature (°C)'] : inputData.Temperature)
  );
  const dissolvedOxygen = Number(
    inputData.do !== undefined
      ? inputData.do
      : (inputData['DO (mg/L)'] !== undefined ? inputData['DO (mg/L)'] : inputData.DO)
  );
  const biologicalOxygenDemand = Number(
    inputData.bod !== undefined
      ? inputData.bod
      : (inputData['BOD (mg/L)'] !== undefined ? inputData['BOD (mg/L)'] : inputData.BOD)
  );
  const lead = Number(
    inputData.lead !== undefined
      ? inputData.lead
      : (inputData['Lead (mg/L)'] !== undefined ? inputData['Lead (mg/L)'] : inputData.Lead)
  );
  const mercury = Number(
    inputData.mercury !== undefined
      ? inputData.mercury
      : (inputData['Mercury (mg/L)'] !== undefined ? inputData['Mercury (mg/L)'] : inputData.Mercury)
  );
  const arsenic = Number(
    inputData.arsenic !== undefined
      ? inputData.arsenic
      : (inputData['Arsenic (mg/L)'] !== undefined ? inputData['Arsenic (mg/L)'] : inputData.Arsenic)
  );

  // Parameter list used for validation error messages
  const parameterChecks = [
    { name: 'pH', value: ph },
    { name: 'Turbidity', value: turbidity },
    { name: 'Temperature', value: temperature },
    { name: 'Dissolved Oxygen (DO)', value: dissolvedOxygen },
    { name: 'Biochemical Oxygen Demand (BOD)', value: biologicalOxygenDemand },
    { name: 'Lead', value: lead },
    { name: 'Mercury', value: mercury },
    { name: 'Arsenic', value: arsenic }
  ];

  for (const item of parameterChecks) {
    if (isNaN(item.value)) {
      throw new Error(`The value for ${item.name} must be a valid number.`);
    }
  }

  // Physical realism checks
  if (ph < 0 || ph > 14) {
    throw new Error(`pH value (${ph}) must be between 0.0 and 14.0.`);
  }
  if (turbidity < 0) throw new Error('Turbidity cannot be a negative value.');
  if (dissolvedOxygen < 0) throw new Error('Dissolved Oxygen cannot be a negative value.');
  if (biologicalOxygenDemand < 0) throw new Error('BOD cannot be a negative value.');
  if (lead < 0) throw new Error('Lead concentration cannot be negative.');
  if (mercury < 0) throw new Error('Mercury concentration cannot be negative.');
  if (arsenic < 0) throw new Error('Arsenic concentration cannot be negative.');

  return {
    ph: ph,
    turbidity: turbidity,
    temperature: temperature,
    do: dissolvedOxygen,
    bod: biologicalOxygenDemand,
    lead: lead,
    mercury: mercury,
    arsenic: arsenic,
    location: inputData.location ? String(inputData.location).trim() : 'Main Lab',
    timestamp: inputData.timestamp ? new Date(inputData.timestamp) : new Date()
  };
}

/**
 * Locates the Python executable with machine learning packages installed.
 * Checks environment variable first, then known user paths, then default PATH.
 */
function getPythonExecutablePath() {
  if (process.env.PYTHON_PATH && fileSystem.existsSync(process.env.PYTHON_PATH)) {
    return process.env.PYTHON_PATH;
  }

  const localAppDataPath = process.env.LOCALAPPDATA || '';
  const standardPython312Path = path.join(localAppDataPath, 'Programs', 'Python', 'Python312', 'python.exe');
  if (fileSystem.existsSync(standardPython312Path)) {
    return standardPython312Path;
  }

  return 'python';
}

/**
 * Runs the Python prediction script via child process and returns parsed JSON output.
 * 
 * @param {Object} cleanParameters - The validated 8 water parameters
 * @returns {Promise<Object>} Model predictions (drinkability score, class, probabilities)
 */
function executePythonPrediction(cleanParameters) {
  return new Promise((resolve, reject) => {
    const pythonExecutable = getPythonExecutablePath();
    const scriptPath = path.resolve(__dirname, '..', 'ml-predict', 'predict.py');

    const parametersPayload = JSON.stringify({
      pH: cleanParameters.ph,
      Turbidity: cleanParameters.turbidity,
      Temperature: cleanParameters.temperature,
      DO: cleanParameters.do,
      BOD: cleanParameters.bod,
      Lead: cleanParameters.lead,
      Mercury: cleanParameters.mercury,
      Arsenic: cleanParameters.arsenic
    });

    const pythonChildProcess = childProcess.spawn(pythonExecutable, [scriptPath, parametersPayload]);

    let standardOutput = '';
    let standardError = '';

    pythonChildProcess.stdout.on('data', (chunk) => {
      standardOutput += chunk.toString();
    });

    pythonChildProcess.stderr.on('data', (chunk) => {
      standardError += chunk.toString();
    });

    pythonChildProcess.on('close', (exitCode) => {
      if (exitCode !== 0) {
        return reject(
          new Error(`Prediction process failed with exit code ${exitCode}. Details: ${standardError || standardOutput}`)
        );
      }

      try {
        const trimmedOutput = standardOutput.trim();
        const firstBraceIndex = trimmedOutput.indexOf('{');
        const lastBraceIndex = trimmedOutput.lastIndexOf('}');

        if (firstBraceIndex === -1 || lastBraceIndex === -1 || lastBraceIndex < firstBraceIndex) {
          return reject(new Error(`Unable to find JSON in script output: ${standardOutput}`));
        }

        const jsonSubstring = trimmedOutput.substring(firstBraceIndex, lastBraceIndex + 1);
        const parsedResponse = JSON.parse(jsonSubstring);

        if (!parsedResponse.success) {
          return reject(new Error(parsedResponse.error || 'Prediction process reported failure.'));
        }

        resolve(parsedResponse);
      } catch (parseError) {
        reject(new Error(`Error reading prediction response: ${parseError.message}. Output was: ${standardOutput}`));
      }
    });

    pythonChildProcess.on('error', (processError) => {
      reject(new Error(`Could not start Python at "${pythonExecutable}": ${processError.message}`));
    });
  });
}

/**
 * Predict water quality for a single lab sample or a batch list of samples.
 * Route: POST /api/predict
 */
const predictWaterQuality = async (request, response, next) => {
  try {
    const requestPayload = request.body;
    const isBatchRequest = Array.isArray(requestPayload);
    const sampleList = isBatchRequest ? requestPayload : [requestPayload];

    if (sampleList.length === 0) {
      return response.status(400).json({
        success: false,
        error: 'Please provide at least one sample with water parameters.'
      });
    }

    const recordsToSave = [];

    for (const rawSample of sampleList) {
      // 1. Clean and validate inputs
      const cleanParams = validateAndCleanWaterParameters(rawSample);

      // 2. Run inference using machine learning model
      const prediction = await executePythonPrediction(cleanParams);

      // 3. Generate WHO regulatory advice and warnings
      const advisory = analyzeParameters(cleanParams, prediction.drinkabilityScore);

      // 4. Construct complete record document
      const recordDocument = {
        ph: cleanParams.ph,
        turbidity: cleanParams.turbidity,
        temperature: cleanParams.temperature,
        do: cleanParams.do,
        bod: cleanParams.bod,
        lead: cleanParams.lead,
        mercury: cleanParams.mercury,
        arsenic: cleanParams.arsenic,
        location: cleanParams.location,
        timestamp: cleanParams.timestamp,
        submittedBy: request.user ? request.user._id : (rawSample.submittedBy || null),
        drinkabilityScore: prediction.drinkabilityScore,
        predictedClass: prediction.predictedClass,
        riskStatus: advisory.riskStatus,
        warnings: advisory.warnings,
        recommendations: advisory.recommendations
      };

      recordsToSave.push(recordDocument);
    }

    // Save to database
    const savedRecords = await WaterRecord.insertMany(recordsToSave);

    return response.status(201).json({
      success: true,
      count: savedRecords.length,
      data: isBatchRequest ? savedRecords : savedRecords[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get historical water test records with optional search and date filters.
 * Route: GET /api/history
 */
const getHistory = async (request, response, next) => {
  try {
    const {
      location,
      riskStatus,
      startDate,
      endDate,
      limit = 100,
      page = 1
    } = request.query;

    const filterCriteria = {};

    if (location) {
      filterCriteria.location = { $regex: location, $options: 'i' };
    }

    if (riskStatus) {
      filterCriteria.riskStatus = riskStatus;
    }

    if (startDate || endDate) {
      filterCriteria.timestamp = {};
      if (startDate) filterCriteria.timestamp.$gte = new Date(startDate);
      if (endDate) filterCriteria.timestamp.$lte = new Date(endDate);
    }

    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skipCount = (pageNumber - 1) * pageSize;

    const totalCount = await WaterRecord.countDocuments(filterCriteria);
    const records = await WaterRecord.find(filterCriteria)
      .sort({ timestamp: -1 })
      .skip(skipCount)
      .limit(pageSize)
      .populate('submittedBy', 'name email role');

    return response.status(200).json({
      success: true,
      total: totalCount,
      page: pageNumber,
      pages: Math.ceil(totalCount / pageSize),
      count: records.length,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a specific record by its database ID.
 * Route: DELETE /api/history/:id
 */
const deleteRecord = async (request, response, next) => {
  try {
    const recordId = request.params.id;
    const existingRecord = await WaterRecord.findById(recordId);

    if (!existingRecord) {
      return response.status(404).json({
        success: false,
        error: `No record found with ID: ${recordId}`
      });
    }

    await existingRecord.deleteOne();

    return response.status(200).json({
      success: true,
      message: 'Water record deleted successfully.',
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
