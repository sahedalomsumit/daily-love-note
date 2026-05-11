const cron = require('node-cron');
const { getRecentMessages, saveMessage } = require('./firebase');
const { generateMessage } = require('./gemini');
const { sendMessage, getStatus } = require('./whatsapp');

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
    const usedMessages = await getRecentMessages(30);

    // 2. Generate via Gemini
    const content = await generateMessage(usedMessages);

    // 3. Send via WhatsApp
    const phone = process.env.WIFE_PHONE;
    await sendMessage(phone, content);

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

// 0 1 * * * UTC is 7:00 AM BST (UTC+6)
cron.schedule('0 1 * * *', () => {
  sendDailyMessage('auto');
});

module.exports = { sendDailyMessage };
