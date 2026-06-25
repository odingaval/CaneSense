const express = require('express');
const router = express.Router();
const Field = require('../models/Field');
const DiagnosisLog = require('../models/DiagnosisLog');

// POST /fields
router.post('/', async (req, res) => {
  try {
    const { farmer_id, name, lat, lng } = req.body;
    
    if (!farmer_id || !name || !lat || !lng) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const field = await Field.create({ farmer_id, name, lat, lng });
    res.status(201).json(field);
  } catch (error) {
    console.error('Error creating field:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /fields/:field_id
router.get('/:field_id', async (req, res) => {
  try {
    const { field_id } = req.params;
    const field = await Field.findById(field_id);
    
    if (!field) {
      return res.status(404).json({ error: 'Field not found' });
    }
    
    const lastDiagnosis = await DiagnosisLog.findByFieldId(field_id);
    
    res.json({
      field,
      last_diagnosis: lastDiagnosis
    });
  } catch (error) {
    console.error('Error fetching field:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
