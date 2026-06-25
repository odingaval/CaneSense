const agronomyRules = require('./agronomyRules');
const SatelliteService = require('../services/satelliteService');
const SoilService = require('../services/soilService');
const RainfallService = require('../services/rainfallService');

async function runDiagnosis(inputs) {
  const { field_id, crop_stage_weeks, symptom, location_in_field, recent_rain } = inputs;
  
  // 1. Gather external data
  const satelliteData = await SatelliteService.getFieldSignals(field_id);
  const soilData = await SoilService.getFieldSoilData(field_id);
  const rainfallData = await RainfallService.getFieldRainfall(field_id);
  
  const ndviTrend = satelliteData.trend;
  const rainfallGapDays = rainfallData.gapDays;
  const soilNitrogen = soilData.nitrogen;
  
  // 2. Check for Featherless API key
  const apiKey = process.env.FEATHERLESS_API_KEY;
  if (apiKey) {
    return await runFeatherlessDiagnosis(inputs, satelliteData, soilData, rainfallData);
  } else {
    // 3. Fallback to local rules
    const result = agronomyRules.evaluate({
      symptom: (symptom || '').toLowerCase(),
      location: (location_in_field || '').toLowerCase(),
      recent_rain,
      rainfall_gap_days: rainfallGapDays,
      ndvi_trend: ndviTrend,
      soil_nitrogen: soilNitrogen
    });
    
    return {
      ...result,
      data_used: {
        ndvi_trend: ndviTrend,
        rainfall_gap_days: rainfallGapDays,
        soil_nitrogen: soilNitrogen
      }
    };
  }
}

async function runFeatherlessDiagnosis(inputs, satData, soilData, rainData) {
  // Stubbed implementation for Featherless API
  const prompt = `You are an agronomic advisor for smallholder sugarcane farmers in Kenya.
A farmer reports: crop stage ${inputs.crop_stage_weeks} weeks, symptom: '${inputs.symptom}', 
location in field: '${inputs.location_in_field}', recent rain: ${inputs.recent_rain}.
Satellite NDVI trend: ${satData.trend}. Days without rain: ${rainData.gapDays}. 
Soil nitrogen: ${soilData.nitrogen}.
Respond in JSON only with: top_cause, confidence, confidence_score, reasoning, 
recommendation, cost_saving, escalate, escalation_reason, sms_summary.`;

  console.log("Calling Featherless API with prompt:", prompt);
  
  try {
    // Note: To use the real OpenAI SDK, you'd do:
    // const { OpenAI } = require("openai");
    // const openai = new OpenAI({ baseURL: process.env.FEATHERLESS_BASE_URL, apiKey: process.env.FEATHERLESS_API_KEY });
    // const response = await openai.chat.completions.create({...})
    
    // Returning mock structure that Featherless would return
    return {
      top_cause: "water_stress",
      confidence: "high",
      confidence_score: 0.85,
      reasoning: "Based on AI analysis...",
      recommendation: "Irrigate...",
      cost_saving: "Saves ~KES 1,500",
      escalate: false,
      escalation_reason: null,
      sms_summary: "CANESENSE: AI generated summary.",
      data_used: {
        ndvi_trend: satData.trend,
        rainfall_gap_days: rainData.gapDays,
        soil_nitrogen: soilData.nitrogen
      }
    };
  } catch (error) {
    console.error("Featherless API error, falling back to rules", error);
    // Fallback if API fails
    const result = agronomyRules.evaluate({
      symptom: (inputs.symptom || '').toLowerCase(),
      location: (inputs.location_in_field || '').toLowerCase(),
      recent_rain: inputs.recent_rain,
      rainfall_gap_days: rainData.gapDays,
      ndvi_trend: satData.trend,
      soil_nitrogen: soilData.nitrogen
    });
    return {
      ...result,
      data_used: {
        ndvi_trend: satData.trend,
        rainfall_gap_days: rainData.gapDays,
        soil_nitrogen: soilData.nitrogen
      }
    };
  }
}

module.exports = { runDiagnosis };
