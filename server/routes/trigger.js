const express = require('express');
const router = express.Router();
const { sendDailyMessage } = require('../scheduler');

router.post('/', async (req, res) => {
  const result = await sendDailyMessage('manual');
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
});

module.exports = router;
