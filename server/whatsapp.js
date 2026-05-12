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
        handleSIGTERM: false,
        handleSIGINT: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-zygote',
            '--disable-extensions'
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
    client.initialize();
});

const initializeClient = async () => {
    if (clientStatus === 'READY' || clientStatus === 'AUTHENTICATED') return client;
    
    console.log('Initializing WhatsApp client...');
    try {
        await client.initialize();
        return client;
    } catch (err) {
        console.error('CRITICAL: Failed to initialize WhatsApp client!');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);
        clientStatus = 'ERROR';
        throw err;
    }
};

// Only auto-initialize if not in a Firebase Function environment
if (!process.env.FIREBASE_CONFIG && !process.env.FUNCTIONS_EMULATOR) {
    initializeClient().catch(console.error);
}

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

module.exports = { getQR, getStatus, sendMessage, initializeClient };
