const patterns = require('../data/stress-patterns.json');

function evaluate(context) {
  const { 
    symptom, 
    location, 
    recent_rain, 
    rainfall_gap_days, 
    ndvi_trend, 
    soil_nitrogen 
  } = context;

  // Rule 1: Water Stress
  if (recent_rain === false && rainfall_gap_days > 10 && ndvi_trend === "declining") {
    const isYellowingLower = symptom.includes("yellow") && location.includes("lower");
    return {
      top_cause: "water_stress",
      confidence: "high",
      confidence_score: 0.88,
      reasoning: "Your field has had no rain for 16 days. The satellite image shows a declining trend matching your report. This does not look like a soil or pest problem.",
      recommendation: isYellowingLower ? "Irrigate the lower third of the field this week if possible." : "Irrigate immediately, prioritise affected sections of field.",
      cost_saving: "Skipping fertilizer this round saves approximately KES 1,500.",
      escalate: false,
      escalation_reason: null,
      sms_summary: "CANESENSE: Water stress (high confidence). Irrigate lower field this week. No fertilizer needed. Saves ~KES1500."
    };
  }

  // Rule 2: Nutrient Deficiency
  if (symptom.includes("yellow") && location.includes("whole field") && soil_nitrogen === "low") {
    return {
      top_cause: "nutrient_deficiency",
      confidence: "high",
      confidence_score: 0.75,
      reasoning: "Your soil nitrogen levels are low, and whole-field yellowing is a classic sign of this deficiency.",
      recommendation: "Apply CAN fertilizer at 50kg/acre.",
      cost_saving: "Applying correct fertilizer now prevents yield loss of up to 30%.",
      escalate: false,
      escalation_reason: null,
      sms_summary: "CANESENSE: Nutrient deficiency (high confidence). Apply CAN fertilizer at 50kg/acre. Saves 30% yield loss."
    };
  }

  // Rule 3: Pest Pressure
  if (symptom.includes("holes") || symptom.includes("white powder") || symptom.includes("patches")) {
    const isConflict = (ndvi_trend !== "declining" && recent_rain === true);
    
    if (isConflict) {
      return {
        top_cause: "unknown",
        confidence: "low",
        confidence_score: 0.35,
        reasoning: "You reported pest-like damage, but satellite and weather data don't show widespread crop stress. This needs a closer look.",
        recommendation: "Please contact an agronomist for a physical inspection.",
        cost_saving: "Early expert intervention prevents misapplication of expensive chemicals.",
        escalate: true,
        escalation_reason: "Conflicting signals between farmer report and satellite data regarding pest pressure.",
        sms_summary: "CANESENSE: Uncertain issue (low confidence). Please escalate. Reply CALL for expert."
      };
    }
    
    return {
      top_cause: "pest_pressure",
      confidence: "medium",
      confidence_score: 0.60,
      reasoning: "The symptoms you described are typical of pest pressure, though satellite data doesn't fully confirm widespread damage yet.",
      recommendation: "Scout for stem borers and apply recommended systemic pesticide if threshold exceeded.",
      cost_saving: "Targeted application saves on unnecessary blanket spraying.",
      escalate: false,
      escalation_reason: null,
      sms_summary: "CANESENSE: Pest pressure (medium confidence). Scout for stem borers. Apply pesticide if needed."
    };
  }

  // Fallback: Unknown
  return {
    top_cause: "unknown",
    confidence: "low",
    confidence_score: 0.2,
    reasoning: "The combination of symptoms and data provided does not clearly match our standard stress profiles.",
    recommendation: "Schedule a visit from a local agronomist.",
    cost_saving: "Avoiding incorrect treatments saves money.",
    escalate: true,
    escalation_reason: "Symptoms do not match known patterns.",
    sms_summary: "CANESENSE: Unknown issue. Please escalate. Reply CALL for expert."
  };
}

module.exports = { evaluate };
