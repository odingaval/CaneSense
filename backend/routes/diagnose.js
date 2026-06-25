const express = require('express');
const router = express.Router();
const diagnoseEngine = require('../reasoning/diagnoseEngine');
const Field = require('../models/Field');
const DiagnosisLog = require('../models/DiagnosisLog');

// POST /diagnose
router.post('/', async (req, res) => {
  try {
    const { 
      field_id, 
      crop_stage_weeks, 
      symptom, 
      location_in_field, 
      recent_rain,
      photo_url
    } = req.body;

    if (!field_id) {
      return res.status(400).json({ error: 'field_id is required' });
    }

    // Run diagnosis engine
    const diagnosisResult = await diagnoseEngine.runDiagnosis({
      field_id,
      crop_stage_weeks,
      symptom,
      location_in_field,
      recent_rain,
      photo_url
    });

    // Save to log
    await DiagnosisLog.save({
      field_id,
      cause: diagnosisResult.top_cause,
      confidence: diagnosisResult.confidence,
      reasoning: diagnosisResult.reasoning,
      recommendation: diagnosisResult.recommendation,
      escalate: diagnosisResult.escalate
    });

    // Update field status
    let newStatus = 'healthy';
    if (diagnosisResult.escalate) {
      newStatus = 'urgent';
    } else if (diagnosisResult.confidence === 'high') {
      newStatus = 'caution';
    }
    await Field.updateStatus(field_id, newStatus);

    res.json(diagnosisResult);
  } catch (error) {
    console.error('Error during diagnosis:', error);
    res.status(500).json({ error: 'Internal server error during diagnosis' });
  }
});

module.exports = router;
