const express = require('express');
const router = express.Router();

// POST /sms
router.post('/', async (req, res) => {
  try {
    const { from, text } = req.body;
    console.log(`Received SMS from ${from}: ${text}`);
    
    // Simplistic mock processing for SMS
    let responseText = "CANESENSE: Request received. We are analysing your field. You will get a diagnosis shortly.";
    
    if (text.toLowerCase().includes('yellowing') && text.toLowerCase().includes('lower')) {
      responseText = "CANESENSE: Water stress (high confidence). Irrigate lower field this week. No fertilizer needed. Saves ~KES1500.";
    } else if (text.toLowerCase().includes('holes')) {
      responseText = "CANESENSE: Possible pest issue. We recommend an agronomist visit. Reply CALL to speak to an expert.";
    }
    
    res.send(responseText);
  } catch (error) {
    console.error('Error processing SMS:', error);
    res.status(500).send("CANESENSE: System error, please try again later.");
  }
});

module.exports = router;
