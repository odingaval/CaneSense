const express = require('express');
const cors = require('cors');
require('dotenv').config();

const fieldsRouter = require('./routes/fields');
const diagnoseRouter = require('./routes/diagnose');
const smsRouter = require('./routes/sms');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

app.use('/fields', fieldsRouter);
app.use('/diagnose', diagnoseRouter);
app.use('/sms', smsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
