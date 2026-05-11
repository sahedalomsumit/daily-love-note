const puppeteer = require('puppeteer');

async function test() {
    console.log('Testing Puppeteer launch...');
    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null
        });
        console.log('Success! Puppeteer version:', await browser.version());
        await browser.close();
    } catch (err) {
        console.error('Puppeteer launch failed!');
        console.error('Error:', err.message);
        console.log('Attempting to find default executable path...');
        try {
            console.log('Default path:', puppeteer.executablePath());
        } catch (e) {
            console.log('Could not determine default path.');
        }
    }
}

test();
