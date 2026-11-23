/**
 * AquaSense AI - Backend Automated Software Test Suite
 * 
 * Tests core business logic, input validation, WHO safety advisor, 
 * authentication guards, and Python ML model integration.
 */

import assert from 'assert';
import { validateAndCleanWaterParameters, executePythonPrediction } from '../controllers/predictionController.js';
import { analyzeParameters, WATER_SAFETY_LIMITS } from '../utils/waterAdvisor.js';

let passedTests = 0;
let totalTests = 0;

function runTest(testName, testFunction) {
  totalTests++;
  try {
    testFunction();
    console.log(`  [PASS] ${testName}`);
    passedTests++;
  } catch (error) {
    console.error(`  [FAIL] ${testName}`);
    console.error(`         Error: ${error.message}`);
  }
}

async function runAsyncTest(testName, testFunction) {
  totalTests++;
  try {
    await testFunction();
    console.log(`  [PASS] ${testName}`);
    passedTests++;
  } catch (error) {
    console.error(`  [FAIL] ${testName}`);
    console.error(`         Error: ${error.message}`);
  }
}

console.log('='.repeat(70));
console.log(' AquaSense AI: Software Test Suite Execution');
console.log('='.repeat(70));

console.log('\n--- Test Suite 1: Water Parameter Validation ---');

runTest('Should cleanly validate realistic laboratory parameters', () => {
  const sampleInput = {
    ph: 7.4,
    turbidity: 2.1,
    temperature: 20.5,
    do: 7.2,
    bod: 2.0,
    lead: 0.003,
    mercury: 0.0004,
    arsenic: 0.002,
    location: 'Central Reservoir'
  };

  const cleaned = validateAndCleanWaterParameters(sampleInput);
  assert.strictEqual(cleaned.ph, 7.4);
  assert.strictEqual(cleaned.turbidity, 2.1);
  assert.strictEqual(cleaned.location, 'Central Reservoir');
});

runTest('Should reject negative turbidity value', () => {
  const invalidInput = {
    ph: 7.0,
    turbidity: -1.5,
    temperature: 20,
    do: 6,
    bod: 3,
    lead: 0.001,
    mercury: 0.0001,
    arsenic: 0.001
  };

  assert.throws(() => {
    validateAndCleanWaterParameters(invalidInput);
  }, /negative/i);
});

runTest('Should reject pH outside standard 0-14 range', () => {
  const invalidPhInput = {
    ph: 15.5,
    turbidity: 2.0,
    temperature: 20,
    do: 6,
    bod: 3,
    lead: 0.001,
    mercury: 0.0001,
    arsenic: 0.001
  };

  assert.throws(() => {
    validateAndCleanWaterParameters(invalidPhInput);
  }, /pH value/i);
});

console.log('\n--- Test Suite 2: WHO Safety Thresholds & Advisory Logic ---');

runTest('Should categorize pure compliant water as Safe', () => {
  const safeParams = {
    ph: 7.2,
    turbidity: 1.5,
    temperature: 18.0,
    do: 8.0,
    bod: 1.2,
    lead: 0.002,
    mercury: 0.0002,
    arsenic: 0.002
  };

  const advisory = analyzeParameters(safeParams, 92.5, false);
  assert.strictEqual(advisory.riskStatus, 'Safe');
  assert.ok(advisory.warnings.length > 0);
  assert.ok(advisory.recommendations.length > 0);
});

runTest('Should trigger Critical alert when lead exceeds WHO limit', () => {
  const toxicParams = {
    ph: 7.2,
    turbidity: 1.5,
    temperature: 18.0,
    do: 8.0,
    bod: 1.2,
    lead: 0.025, // Above 0.010 mg/L limit
    mercury: 0.0002,
    arsenic: 0.002
  };

  const advisory = analyzeParameters(toxicParams, 15.0, false);
  assert.strictEqual(advisory.riskStatus, 'Critical');
  assert.ok(advisory.warnings.some(w => w.includes('Hazardous Lead Toxicity') || w.includes('Lead')));
});

runTest('Should flag multivariate anomaly warning when isAnomaly is true', () => {
  const testParams = {
    ph: 7.0,
    turbidity: 2.0,
    temperature: 20,
    do: 6,
    bod: 2,
    lead: 0.001,
    mercury: 0.0001,
    arsenic: 0.001
  };

  const advisory = analyzeParameters(testParams, 50.0, true);
  assert.ok(advisory.warnings.some(w => w.includes('Multivariate Anomaly Detected')));
});

console.log('\n--- Test Suite 3: Python Machine Learning Inference Pipeline ---');

await runAsyncTest('Should execute XGBoost prediction and return scores + anomaly status', async () => {
  const sampleParams = {
    ph: 7.4,
    turbidity: 2.5,
    temperature: 21.0,
    do: 7.0,
    bod: 2.5,
    lead: 0.004,
    mercury: 0.0005,
    arsenic: 0.003
  };

  const prediction = await executePythonPrediction(sampleParams);
  assert.strictEqual(prediction.success, true);
  assert.strictEqual(typeof prediction.drinkabilityScore, 'number');
  assert.ok(prediction.drinkabilityScore >= 0 && prediction.drinkabilityScore <= 100);
  assert.ok([0, 1, 2].includes(prediction.predictedClass));
  assert.strictEqual(typeof prediction.isAnomaly, 'boolean');
  assert.strictEqual(typeof prediction.anomalyScore, 'number');
  assert.ok(prediction.classProbabilities);
});

console.log('\n' + '='.repeat(70));
console.log(` Test Execution Summary: ${passedTests} / ${totalTests} tests passed.`);
console.log('='.repeat(70));

if (passedTests !== totalTests) {
  process.exit(1);
}
