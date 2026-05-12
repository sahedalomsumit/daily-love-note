const express = require('express');
const router = express.Router();
const { sendDailyMessage } = require('../scheduler');

router.post('/', async (req, res) => {
  try {
    console.log('Manual trigger initiated...');
    const result = await sendDailyMessage('manual');
    if (result.success) {
      console.log('Manual trigger successful');
      res.json(result);
    } else {
      console.warn('Manual trigger failed:', result.error);
      // Use 400 for "expected" failures like WhatsApp not being ready
      const statusCode = result.error === 'WhatsApp disconnected' ? 400 : 500;
      res.status(statusCode).json(result);
    }
  } catch (error) {
    console.error('CRITICAL: Manual trigger route crashed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal Server Error', 
      message: error.message,
      stack: error.stack 
    });
  }
});

module.exports = router;
