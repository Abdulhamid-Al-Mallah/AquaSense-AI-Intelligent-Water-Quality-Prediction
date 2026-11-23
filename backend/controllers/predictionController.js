import childProcess from 'child_process';
import path from 'path';
import fileSystem from 'fs';
import { fileURLToPath } from 'url';
import asyncHandler from 'express-async-handler';
import WaterRecord from '../models/WaterRecord.js';
import { analyzeParameters } from '../utils/waterAdvisor.js';

// Setup current directory path for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Validates and standardizes water quality lab parameters entered by users.
 * Ensures all numbers are non-negative and within realistic physical ranges.
 * 
 * @param {Object} inputData - Raw water reading submitted from client
 * @returns {Object} Cleaned, validated numbers and metadata
 */
export function validateAndCleanWaterParameters(inputData) {
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
 */
export function getPythonExecutablePath() {
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
export function executePythonPrediction(cleanParameters) {
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
export const predictWaterQuality = asyncHandler(async (request, response) => {
  const requestPayload = request.body;
  const isBatchRequest = Array.isArray(requestPayload);
  const sampleList = isBatchRequest ? requestPayload : [requestPayload];

  if (sampleList.length === 0) {
    response.status(400);
    throw new Error('Please provide at least one sample with water parameters.');
  }

  const recordsToSave = [];

  for (const rawSample of sampleList) {
    const cleanParams = validateAndCleanWaterParameters(rawSample);
    const prediction = await executePythonPrediction(cleanParams);
    const advisory = analyzeParameters(cleanParams, prediction.drinkabilityScore, prediction.isAnomaly);

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
      isAnomaly: Boolean(prediction.isAnomaly),
      anomalyScore: Number(prediction.anomalyScore || 0),
      warnings: advisory.warnings,
      recommendations: advisory.recommendations
    };

    recordsToSave.push(recordDocument);
  }

  const savedRecords = await WaterRecord.insertMany(recordsToSave);

  response.status(201).json({
    success: true,
    count: savedRecords.length,
    data: isBatchRequest ? savedRecords : savedRecords[0]
  });
});

/**
 * Get historical water test records with optional search and date filters.
 * Route: GET /api/history
 */
export const getHistory = asyncHandler(async (request, response) => {
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

  response.status(200).json({
    success: true,
    total: totalCount,
    page: pageNumber,
    pages: Math.ceil(totalCount / pageSize),
    count: records.length,
    data: records
  });
});

/**
 * Delete a specific record by its database ID.
 * Route: DELETE /api/history/:id
 */
export const deleteRecord = asyncHandler(async (request, response) => {
  const recordId = request.params.id;
  const existingRecord = await WaterRecord.findById(recordId);

  if (!existingRecord) {
    response.status(404);
    throw new Error(`No record found with ID: ${recordId}`);
  }

  await existingRecord.deleteOne();

  response.status(200).json({
    success: true,
    message: 'Water record deleted successfully.',
    data: {}
  });
});

/**
 * Batch import and prediction endpoint for CSV / dataset bulk ingestion.
 * Route: POST /api/predict/batch
 */
export const batchPredictWaterQuality = asyncHandler(async (request, response) => {
  const { samples } = request.body;
  const sampleList = Array.isArray(samples) ? samples : (Array.isArray(request.body) ? request.body : []);

  if (sampleList.length === 0) {
    response.status(400);
    throw new Error('Please provide an array of samples under "samples" or in the request body.');
  }

  const processedRecords = [];
  let anomaliesCount = 0;
  let safeCount = 0;
  let moderateCount = 0;
  let criticalCount = 0;

  for (const rawSample of sampleList) {
    try {
      const cleanParams = validateAndCleanWaterParameters(rawSample);
      const prediction = await executePythonPrediction(cleanParams);
      const advisory = analyzeParameters(cleanParams, prediction.drinkabilityScore, prediction.isAnomaly);

      if (prediction.isAnomaly) anomaliesCount++;
      if (advisory.riskStatus === 'Safe') safeCount++;
      else if (advisory.riskStatus === 'Moderate') moderateCount++;
      else criticalCount++;

      processedRecords.push({
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
        isAnomaly: Boolean(prediction.isAnomaly),
        anomalyScore: Number(prediction.anomalyScore || 0),
        warnings: advisory.warnings,
        recommendations: advisory.recommendations
      });
    } catch (parseOrPredictErr) {
      console.warn(`[Batch Ingestion] Skipping invalid record:`, parseOrPredictErr.message);
    }
  }

  if (processedRecords.length === 0) {
    response.status(400);
    throw new Error('None of the submitted batch samples could be validated or predicted.');
  }

  const savedRecords = await WaterRecord.insertMany(processedRecords);

  response.status(201).json({
    success: true,
    totalSubmitted: sampleList.length,
    totalProcessed: savedRecords.length,
    statistics: {
      safe: safeCount,
      moderate: moderateCount,
      critical: criticalCount,
      anomaliesDetected: anomaliesCount
    },
    data: savedRecords
  });
});

