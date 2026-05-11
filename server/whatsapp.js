const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let qrCodeData = null;
let clientStatus = 'DISCONNECTED';

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './.wwebjs_auth'
    }),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null
    }
});

client.on('qr', (qr) => {
    qrCodeData = qr;
    clientStatus = 'QR_READY';
    console.log('QR RECEIVED', qr);
    // Optional: display in terminal for debugging
    // qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    qrCodeData = null;
    clientStatus = 'READY';
    console.log('Client is ready!');
});

client.on('authenticated', () => {
    clientStatus = 'AUTHENTICATED';
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    clientStatus = 'DISCONNECTED';
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('disconnected', (reason) => {
    clientStatus = 'DISCONNECTED';
    console.log('Client was logged out', reason);
    client.initialize();
});

console.log('Initializing WhatsApp client...');
client.initialize().catch(err => {
    console.error('Failed to initialize WhatsApp client:', err.message);
    clientStatus = 'ERROR';
});

const getQR = () => qrCodeData;
const getStatus = () => clientStatus;
const sendMessage = async (phone, text) => {
    if (clientStatus !== 'READY') {
        throw new Error('WhatsApp client is not ready');
    }
    
    // Format phone: remove '+' and append '@c.us' if not already present
    let chatId = phone.replace('+', '');
    if (!chatId.includes('@')) {
        chatId = `${chatId}@c.us`;
    }
    
    console.log(`Sending message to ${chatId}...`);
    return await client.sendMessage(chatId, text);
};

module.exports = { getQR, getStatus, sendMessage };
