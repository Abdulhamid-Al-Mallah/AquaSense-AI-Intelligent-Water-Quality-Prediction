/**
 * AquaSense AI - Water Quality Advisory Engine
 * 
 * Compares laboratory parameters against World Health Organization (WHO)
 * and Environmental Protection Agency (EPA) drinking water guidelines.
 * Returns human-readable warnings and specific water treatment recommendations.
 */

// Official WHO & EPA Maximum Acceptable Thresholds for Safe Drinking Water
export const WATER_SAFETY_LIMITS = {
  MINIMUM_SAFE_PH: 6.5,
  MAXIMUM_SAFE_PH: 8.5,
  MAXIMUM_TURBIDITY_NTU: 5.0,
  MINIMUM_DISSOLVED_OXYGEN_MG_L: 5.0,
  MAXIMUM_BIOCHEMICAL_DEMAND_MG_L: 5.0,
  MAXIMUM_LEAD_MG_L: 0.010,    // 10 micrograms per liter
  MAXIMUM_MERCURY_MG_L: 0.006, // 6 micrograms per liter
  MAXIMUM_ARSENIC_MG_L: 0.010  // 10 micrograms per liter
};

/**
 * Analyzes water parameters and produces human-friendly warnings and treatment steps.
 * 
 * @param {Object} parameters - The 8 lab water measurements
 * @param {number|null} drinkabilityScore - Optional continuous prediction score (0 to 100)
 * @returns {Object} { warnings, recommendations, riskStatus }
 */
export function analyzeParameters(parameters, drinkabilityScore = null, isAnomaly = false) {
  const detectedWarnings = [];
  const actionRecommendations = [];

  if (isAnomaly) {
    detectedWarnings.push(
      'Multivariate Anomaly Detected: The multi-parameter combination deviates significantly from standard hydrological baseline patterns (Isolation Forest outlier flag).'
    );
    actionRecommendations.push(
      'Conduct immediate secondary laboratory resampling and inspect sensor calibration to eliminate multi-parameter distortion.'
    );
  }

  const phValue = Number(parameters.ph);
  const turbidityValue = Number(parameters.turbidity);
  const temperatureValue = Number(parameters.temperature);
  const dissolvedOxygenValue = Number(parameters.do);
  const biologicalOxygenDemand = Number(parameters.bod);
  const leadConcentration = Number(parameters.lead);
  const mercuryConcentration = Number(parameters.mercury);
  const arsenicConcentration = Number(parameters.arsenic);

  // 1. pH Level Evaluation
  if (phValue < WATER_SAFETY_LIMITS.MINIMUM_SAFE_PH) {
    detectedWarnings.push(
      `Acidic Water Alert (pH ${phValue.toFixed(2)}): Below the WHO minimum safe threshold of ${WATER_SAFETY_LIMITS.MINIMUM_SAFE_PH}.`
    );
    actionRecommendations.push(
      'Perform pH neutralization using a calcite/corosex filter or sodium carbonate (soda ash) injection to stop pipe corrosion and metal leaching.'
    );
  } else if (phValue > WATER_SAFETY_LIMITS.MAXIMUM_SAFE_PH) {
    detectedWarnings.push(
      `Alkaline Water Alert (pH ${phValue.toFixed(2)}): Exceeds the WHO maximum safe threshold of ${WATER_SAFETY_LIMITS.MAXIMUM_SAFE_PH}.`
    );
    actionRecommendations.push(
      'Inject food-grade neutralizing acid (such as dilute citric or hydrochloric acid) to bring the water to a neutral 7.0–7.5 range.'
    );
  }

  // 2. Turbidity (Clarity) Evaluation
  if (turbidityValue > WATER_SAFETY_LIMITS.MAXIMUM_TURBIDITY_NTU) {
    detectedWarnings.push(
      `High Cloudiness / Turbidity (${turbidityValue.toFixed(2)} NTU): Exceeds drinking standard of ${WATER_SAFETY_LIMITS.MAXIMUM_TURBIDITY_NTU} NTU.`
    );
    actionRecommendations.push(
      'Apply chemical coagulation (alum or polyaluminum chloride) followed by rapid sand or multimedia filtration to clarify suspended particles.'
    );
  }

  // 3. Dissolved Oxygen (DO) Evaluation
  if (dissolvedOxygenValue < WATER_SAFETY_LIMITS.MINIMUM_DISSOLVED_OXYGEN_MG_L) {
    detectedWarnings.push(
      `Low Dissolved Oxygen (${dissolvedOxygenValue.toFixed(2)} mg/L): Below the healthy limit of ${WATER_SAFETY_LIMITS.MINIMUM_DISSOLVED_OXYGEN_MG_L} mg/L, indicating stagnation or organic breakdown.`
    );
    actionRecommendations.push(
      'Implement cascade or diffused bubble aeration to raise dissolved oxygen levels and eliminate sulfurous odors.'
    );
  }

  // 4. Biochemical Oxygen Demand (BOD) Evaluation
  if (biologicalOxygenDemand > WATER_SAFETY_LIMITS.MAXIMUM_BIOCHEMICAL_DEMAND_MG_L) {
    detectedWarnings.push(
      `High Organic Load (BOD ${biologicalOxygenDemand.toFixed(2)} mg/L): Exceeds safety guideline of ${WATER_SAFETY_LIMITS.MAXIMUM_BIOCHEMICAL_DEMAND_MG_L} mg/L, indicating organic runoff or wastewater.`
    );
    actionRecommendations.push(
      'Deploy biological filtration or advanced oxidation processes (UV light with hydrogen peroxide/ozone) to degrade organic pollutants.'
    );
  }

  // 5. Heavy Metal: Lead Evaluation
  if (leadConcentration > WATER_SAFETY_LIMITS.MAXIMUM_LEAD_MG_L) {
    detectedWarnings.push(
      `Hazardous Lead Toxicity (${leadConcentration.toFixed(4)} mg/L): Exceeds the strict WHO maximum limit of ${WATER_SAFETY_LIMITS.MAXIMUM_LEAD_MG_L} mg/L.`
    );
    actionRecommendations.push(
      'Immediately pass water through high-rejection Reverse Osmosis (RO) membranes or lead-selective ion-exchange resin filters.'
    );
  }

  // 6. Heavy Metal: Mercury Evaluation
  if (mercuryConcentration > WATER_SAFETY_LIMITS.MAXIMUM_MERCURY_MG_L) {
    detectedWarnings.push(
      `Critical Mercury Toxicity (${mercuryConcentration.toFixed(4)} mg/L): Exceeds the safe drinking threshold of ${WATER_SAFETY_LIMITS.MAXIMUM_MERCURY_MG_L} mg/L.`
    );
    actionRecommendations.push(
      'Deploy granular activated carbon (GAC) filtration coupled with reverse osmosis to eliminate dissolved toxic mercury compounds.'
    );
  }

  // 7. Heavy Metal: Arsenic Evaluation
  if (arsenicConcentration > WATER_SAFETY_LIMITS.MAXIMUM_ARSENIC_MG_L) {
    detectedWarnings.push(
      `Dangerous Arsenic Contamination (${arsenicConcentration.toFixed(4)} mg/L): Exceeds the maximum permissible limit of ${WATER_SAFETY_LIMITS.MAXIMUM_ARSENIC_MG_L} mg/L.`
    );
    actionRecommendations.push(
      'Use activated alumina adsorption media or ferric chloride co-precipitation to extract arsenic ions from the supply.'
    );
  }

  // 8. Water Temperature Consideration
  if (temperatureValue > 30) {
    detectedWarnings.push(
      `Elevated Water Temperature (${temperatureValue.toFixed(1)}°C): Encourages microbial growth and reduces oxygen saturation.`
    );
    actionRecommendations.push(
      'Ensure proper thermal shading for storage tanks and maintain continuous disinfection residual.'
    );
  }

  // If water is completely clean and complies with all thresholds
  if (detectedWarnings.length === 0) {
    detectedWarnings.push('All chemical and physical parameters comply with WHO safe drinking standards.');
    actionRecommendations.push('Maintain regular monitoring and standard routine UV or chlorination disinfection.');
  }

  // Determine overall risk category
  let calculatedRiskStatus = 'Safe';
  if (drinkabilityScore !== null) {
    if (drinkabilityScore >= 75) {
      calculatedRiskStatus = 'Safe';
    } else if (drinkabilityScore >= 40) {
      calculatedRiskStatus = 'Moderate';
    } else {
      calculatedRiskStatus = 'Critical';
    }
  } else {
    const hasDangerousHeavyMetals =
      leadConcentration > WATER_SAFETY_LIMITS.MAXIMUM_LEAD_MG_L ||
      mercuryConcentration > WATER_SAFETY_LIMITS.MAXIMUM_MERCURY_MG_L ||
      arsenicConcentration > WATER_SAFETY_LIMITS.MAXIMUM_ARSENIC_MG_L;

    if (hasDangerousHeavyMetals) {
      calculatedRiskStatus = 'Critical';
    } else if (
      turbidityValue > WATER_SAFETY_LIMITS.MAXIMUM_TURBIDITY_NTU ||
      biologicalOxygenDemand > WATER_SAFETY_LIMITS.MAXIMUM_BIOCHEMICAL_DEMAND_MG_L ||
      phValue < WATER_SAFETY_LIMITS.MINIMUM_SAFE_PH ||
      phValue > WATER_SAFETY_LIMITS.MAXIMUM_SAFE_PH
    ) {
      calculatedRiskStatus = 'Moderate';
    }
  }

  return {
    warnings: detectedWarnings,
    recommendations: actionRecommendations,
    riskStatus: calculatedRiskStatus
  };
}
