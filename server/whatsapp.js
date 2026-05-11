const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let qrCodeData = null;
let clientStatus = 'DISCONNECTED';

const fs = require('fs');
const path = require('path');

// Auto-finder for Puppeteer on Render
const getExecutablePath = () => {
    if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
    
    // Common Render paths for chrome installed via npx puppeteer browsers install chrome
    const possiblePaths = [
        // Path when Root Directory is 'server'
        '/opt/render/project/src/server/node_modules/puppeteer/.local-chromium',
        '/opt/render/project/puppeteer',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/google-chrome'
    ];

    for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
            console.log(`Found Chrome at: ${p}`);
            return p;
        }
    }
    
    return null; // Fallback to puppeteer default
};

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './.wwebjs_auth'
    }),
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.3000.1014711009-alpha.html',
    },
    authTimeoutMs: 120000, // Increase to 120s
    puppeteer: {
        headless: 'new',
        handleSIGTERM: false,
        handleSIGINT: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-zygote',
            '--disable-extensions',
            '--disable-accelerated-2d-canvas',
            '--disable-canvas-aa',
            '--disable-2d-canvas-clip-aa',
            '--disable-gl-drawing-for-tests',
            '--mute-audio',
            '--no-first-run',
            '--no-default-browser-check',
            '--disable-breakpad',
            '--disable-canvas-aa',
            '--disable-composited-antialiasing',
            '--disable-infobars',
            '--disable-notifications',
            '--disable-offer-store-unmasked-wallet-cards',
            '--disable-print-preview',
            '--disable-speech-api',
            '--disable-web-security',
            '--ignore-certificate-errors',
            '--ignore-certificate-errors-spki-list'
        ],
        executablePath: getExecutablePath()
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
    // Add delay before reconnecting to prevent memory/CPU spikes
    setTimeout(() => {
        console.log('Attempting to re-initialize WhatsApp client...');
        client.initialize().catch(err => console.error('Re-initialization failed:', err.message));
    }, 5000);
});

console.log('Initializing WhatsApp client...');
client.initialize().catch(err => {
    console.error('CRITICAL: Failed to initialize WhatsApp client!');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    console.error('Full Stack:', err.stack);
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
