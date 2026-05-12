const express = require('express');
const router = express.Router();
const { getQR, getPairingCode, getStatus } = require('../whatsapp');
const QRCode = require('qrcode');

router.get('/', async (req, res) => {
  const status = getStatus();
  const qrRaw = getQR();
  let qrBase64 = null;

  if (qrRaw && status === 'QR_READY') {
    try {
      qrBase64 = await QRCode.toDataURL(qrRaw);
    } catch (err) {
      console.error('QR conversion error:', err);
    }
  }

  res.json({
    status,
    qr: qrBase64,
    pairingCode: getPairingCode(),
    senderPhone: process.env.SENDER_PHONE,
    wifePhone: process.env.WIFE_PHONE,
    models: (process.env.GEMINI_MODELS || "").split(',').map(m => m.trim()).filter(m => m)
  });
});

router.post('/reconnect', async (req, res) => {
  const { reconnectClient } = require('../whatsapp');
  const result = await reconnectClient();
  res.json(result);
});

module.exports = router;
