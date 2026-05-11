require('dotenv').config();
const { getAllMessages } = require('./firebase');

async function test() {
  try {
    console.log('Fetching messages...');
    const messages = await getAllMessages();
    console.log('Success!', messages.length, 'messages found.');
  } catch (error) {
    console.error('Failed!', error);
  }
}

test();
