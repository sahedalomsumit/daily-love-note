const { Client, LocalAuth } = require('whatsapp-web.js');

console.log('Attempting to initialize WhatsApp client...');
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './.wwebjs_auth'
    }),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        // headless: true
    }
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    process.exit(0);
});

client.on('ready', () => {
    console.log('Client is ready!');
    process.exit(0);
});

client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
    process.exit(1);
});

client.initialize().catch(err => {
    console.error('Initialization error:', err);
    process.exit(1);
});

// Timeout after 30 seconds
setTimeout(() => {
    console.log('Timed out waiting for QR or Ready');
    process.exit(1);
}, 30000);
