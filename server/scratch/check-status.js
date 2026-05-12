require('dotenv').config();
const { getStatus } = require('./whatsapp');
console.log('Current WhatsApp Status:', getStatus());
