const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let qrCodeData = null;
let pairingCode = null;
let clientStatus = 'DISCONNECTED';

const fs = require('fs');
const path = require('path');

// Auto-finder for Puppeteer
const getExecutablePath = () => {
    if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
    
    // Common paths for chrome
    const possiblePaths = [
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

client.on('qr', async (qr) => {
    if (process.env.SENDER_PHONE) {
        try {
            console.log('Requesting pairing code for:', process.env.SENDER_PHONE);
            pairingCode = await client.requestPairingCode(process.env.SENDER_PHONE.replace(/\D/g, ''));
            clientStatus = 'PAIRING_READY';
            console.log('PAIRING CODE RECEIVED:', pairingCode);
        } catch (err) {
            console.error('Failed to request pairing code, falling back to QR:', err);
            qrCodeData = qr;
            clientStatus = 'QR_READY';
        }
    } else {
        qrCodeData = qr;
        clientStatus = 'QR_READY';
        console.log('QR RECEIVED', qr);
    }
});

client.on('ready', () => {
    qrCodeData = null;
    pairingCode = null;
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
const getPairingCode = () => pairingCode;
const getStatus = () => clientStatus;
const reconnectClient = async () => {
    console.log('Manual reconnect requested...');
    // If client is already initializing, don't start another one
    if (clientStatus === 'INITIALIZING') return { success: true, status: 'ALREADY_INITIALIZING' };
    
    qrCodeData = null;
    pairingCode = null;
    clientStatus = 'INITIALIZING';
    
    try {
        // We don't await initialize() here because it's a long process
        // We just trigger it and let the events handle the rest
        client.initialize().catch(err => {
            console.error('Reconnect failed:', err);
            clientStatus = 'ERROR';
        });
        return { success: true, status: 'INITIALIZING' };
    } catch (err) {
        clientStatus = 'ERROR';
        return { success: false, error: err.message };
    }
};
const sendMessage = async (phone, text) => {
    if (clientStatus !== 'READY') {
        throw new Error('WhatsApp disconnected');
    }

    if (!phone) {
        throw new Error('Recipient phone number is missing');
    }
    
    // Format phone: remove '+' and append '@c.us' if not already present
    let chatId = phone.toString().replace('+', '').replace(/\D/g, '');
    if (!chatId.includes('@')) {
        chatId = `${chatId}@c.us`;
    }
    
    console.log(`Sending message to ${chatId}...`);
    return await client.sendMessage(chatId, text);
};

module.exports = { getQR, getPairingCode, getStatus, sendMessage, initializeClient, reconnectClient };
