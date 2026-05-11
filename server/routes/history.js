const express = require('express');
const router = express.Router();
const { getAllMessages } = require('../firebase');

router.get('/', async (req, res) => {
  try {
    const messages = await getAllMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
