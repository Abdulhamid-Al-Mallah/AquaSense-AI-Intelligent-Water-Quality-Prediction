/**
 * AquaSense AI - Decision-Support & Regulatory Engine
 * Evaluates laboratory chemical & physical parameters against WHO/EPA drinking water standards.
 * Generates automated warnings and concrete remediation steps.
 */

// WHO / EPA Standard Reference Thresholds
const WHO_STANDARDS = {
  PH_MIN: 6.5,
  PH_MAX: 8.5,
  TURBIDITY_MAX: 5.0, // NTU
  DO_MIN: 5.0,        // mg/L (Minimum dissolved oxygen for healthy water)
  BOD_MAX: 5.0,       // mg/L (Biochemical oxygen demand)
  LEAD_MAX: 0.01,     // mg/L (10 ppb)
  MERCURY_MAX: 0.006, // mg/L (6 ppb)
  ARSENIC_MAX: 0.01   // mg/L (10 ppb)
};

/**
 * Analyze laboratory parameters and produce regulatory warnings and remediation advice.
 * @param {Object} params - Water laboratory parameters
 * @returns {Object} { warnings: string[], recommendations: string[], riskStatus: string }
 */
function analyzeParameters(params, drinkabilityScore = null) {
  const warnings = [];
  const recommendations = [];

  const ph = Number(params.ph);
  const turbidity = Number(params.turbidity);
  const temperature = Number(params.temperature);
  const doVal = Number(params.do);
  const bod = Number(params.bod);
  const lead = Number(params.lead);
  const mercury = Number(params.mercury);
  const arsenic = Number(params.arsenic);

  // 1. pH Assessment
  if (ph < WHO_STANDARDS.PH_MIN) {
    warnings.push(`Acidic pH alert (${ph.toFixed(2)}): Below WHO recommended lower limit of ${WHO_STANDARDS.PH_MIN}.`);
    recommendations.push("Implement pH neutralization using sodium carbonate (soda ash) injection or calcite/corosex neutralizing filters to prevent pipe corrosion and heavy metal leaching.");
  } else if (ph > WHO_STANDARDS.PH_MAX) {
    warnings.push(`Alkaline pH alert (${ph.toFixed(2)}): Exceeds WHO recommended upper limit of ${WHO_STANDARDS.PH_MAX}.`);
    recommendations.push("Acid injection neutralization (dilute sulfuric or hydrochloric acid feed) to restore pH to the neutral 7.0–7.5 range.");
  }

  // 2. Turbidity Assessment
  if (turbidity > WHO_STANDARDS.TURBIDITY_MAX) {
    warnings.push(`High Turbidity (${turbidity.toFixed(2)} NTU): Exceeds standard drinking limit of ${WHO_STANDARDS.TURBIDITY_MAX} NTU.`);
    recommendations.push("Deploy rapid sand filtration combined with chemical coagulation/flocculation (alum or polyaluminum chloride) to clarify suspended solids before disinfection.");
  }

  // 3. Dissolved Oxygen (DO) Assessment
  if (doVal < WHO_STANDARDS.DO_MIN) {
    warnings.push(`Low Dissolved Oxygen (${doVal.toFixed(2)} mg/L): Below the healthy guideline of ${WHO_STANDARDS.DO_MIN} mg/L, indicating stagnation or organic decay.`);
    recommendations.push("Introduce mechanical cascade aeration or diffused bubble aerators to elevate dissolved oxygen and reduce unpleasant taste/odors.");
  }

  // 4. Biochemical Oxygen Demand (BOD) Assessment
  if (bod > WHO_STANDARDS.BOD_MAX) {
    warnings.push(`Elevated Biochemical Oxygen Demand (${bod.toFixed(2)} mg/L): Above safety threshold of ${WHO_STANDARDS.BOD_MAX} mg/L, suggesting organic wastewater contamination.`);
    recommendations.push("Apply biological activated sludge or advanced oxidation processes (UV/Ozone/Peroxide) to degrade residual organic pollutants.");
  }

  // 5. Heavy Metals: Lead
  if (lead > WHO_STANDARDS.LEAD_MAX) {
    warnings.push(`Dangerous Lead Contamination (${lead.toFixed(4)} mg/L): Exceeds strict WHO maximum permissible level of ${WHO_STANDARDS.LEAD_MAX} mg/L.`);
    recommendations.push("Install industrial Reverse Osmosis (RO) membranes or specialized lead-selective ion-exchange resin filtration systems immediately.");
  }

  // 6. Heavy Metals: Mercury
  if (mercury > WHO_STANDARDS.MERCURY_MAX) {
    warnings.push(`Critical Mercury Toxicity (${mercury.toFixed(4)} mg/L): Exceeds WHO safety threshold of ${WHO_STANDARDS.MERCURY_MAX} mg/L.`);
    recommendations.push("Deploy Granular Activated Carbon (GAC) pre-treatment followed by high-rejection Reverse Osmosis (RO) to eliminate toxic mercury ions.");
  }

  // 7. Heavy Metals: Arsenic
  if (arsenic > WHO_STANDARDS.ARSENIC_MAX) {
    warnings.push(`Critical Arsenic Contamination (${arsenic.toFixed(4)} mg/L): Exceeds WHO limit of ${WHO_STANDARDS.ARSENIC_MAX} mg/L.`);
    recommendations.push("Employ activated alumina adsorption filters or ferric chloride co-precipitation to strip arsenic compounds from the supply.");
  }

  // 8. Temperature considerations
  if (temperature > 30) {
    warnings.push(`Elevated Water Temperature (${temperature.toFixed(1)}°C): Promotes microbial proliferation and reduces dissolved oxygen solubility.`);
    recommendations.push("Protect storage reservoirs with solar-reflective thermal insulation and ensure continuous chlorination residual.");
  }

  // Fallback if pristine
  if (warnings.length === 0) {
    warnings.push("All physical and chemical parameters are compliant with WHO drinking standards.");
    recommendations.push("Maintain standard inline multi-barrier disinfection (UV radiation or routine chlorination) and scheduled periodic testing.");
  }

  // Calculate Risk Status based on project specification:
  // 'Safe' for >= 75, 'Moderate' for 40-74.9, 'Critical' for < 40
  let riskStatus = 'Safe';
  if (drinkabilityScore !== null) {
    if (drinkabilityScore >= 75) {
      riskStatus = 'Safe';
    } else if (drinkabilityScore >= 40) {
      riskStatus = 'Moderate';
    } else {
      riskStatus = 'Critical';
    }
  } else {
    // If score not yet provided, compute initial heuristic
    if (lead > WHO_STANDARDS.LEAD_MAX || mercury > WHO_STANDARDS.MERCURY_MAX || arsenic > WHO_STANDARDS.ARSENIC_MAX) {
      riskStatus = 'Critical';
    } else if (turbidity > WHO_STANDARDS.TURBIDITY_MAX || bod > WHO_STANDARDS.BOD_MAX || ph < WHO_STANDARDS.PH_MIN || ph > WHO_STANDARDS.PH_MAX) {
      riskStatus = 'Moderate';
    }
  }

  return {
    warnings,
    recommendations,
    riskStatus
  };
}

module.exports = {
  WHO_STANDARDS,
  analyzeParameters
};
