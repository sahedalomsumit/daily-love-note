const cron = require('node-cron');
const { getRecentMessages, saveMessage } = require('./firebase');
const { generateMessage } = require('./gemini');
const { sendMessage, getStatus, initializeClient } = require('./whatsapp');
const { onSchedule } = require('firebase-functions/v2/scheduler');

const sendDailyMessage = async (triggeredBy = 'auto') => {
  console.log(`Starting daily message task (triggered by: ${triggeredBy})`);
  
  if (getStatus() !== 'READY') {
    console.error('WhatsApp client not ready. Skipping message.');
    await saveMessage({
      content: 'Failed to send: WhatsApp disconnected',
      status: 'failed',
      triggeredBy
    });
    return { success: false, error: 'WhatsApp disconnected' };
  }

  try {
    // 1. Fetch last 30 messages
    console.log('Fetching recent messages from Firebase...');
    const usedMessages = await getRecentMessages(30);
    console.log(`Found ${usedMessages.length} recent messages.`);

    // 2. Generate via Gemini
    console.log('Generating message via Gemini...');
    const content = await generateMessage(usedMessages);
    console.log('Message generated:', content);

    // 3. Send via WhatsApp
    const phone = process.env.WIFE_PHONE;
    console.log(`Sending WhatsApp message to ${phone}...`);
    await sendMessage(phone, content);
    console.log('WhatsApp message sent.');

    // 4. Save to Firestore
    await saveMessage({
      content,
      status: 'sent',
      triggeredBy
    });

    console.log('Daily message sent successfully');
    return { success: true, content };
  } catch (error) {
    console.error('Error in sendDailyMessage:', error);
    await saveMessage({
      content: `Error: ${error.message}`,
      status: 'failed',
      triggeredBy
    }).catch(e => console.error('Failed to save error to Firestore:', e.message));
    
    return { 
      success: false, 
      error: error.message,
      details: error.stack
    };
  }
};

// Firebase Scheduled Function
exports.dailyTask = onSchedule({
  schedule: '0 1 * * *', // 7:00 AM BST (UTC+6)
  timeZone: 'UTC',
  memory: '1GiB',
  timeoutSeconds: 540 // Max 9 minutes
}, async (event) => {
  console.log('Running scheduled daily message task');
  try {
    // In a stateless function, we MUST initialize the client every time
    // This will only work if the session is saved and restored
    await initializeClient();
    
    // Wait for READY status (max 60 seconds)
    let attempts = 0;
    while (getStatus() !== 'READY' && attempts < 12) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;
    }

    await sendDailyMessage('auto');
  } catch (error) {
    console.error('Scheduled task failed:', error);
  }
});

module.exports = { sendDailyMessage };
