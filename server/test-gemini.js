require('dotenv').config();
const { generateMessage } = require('./gemini');

async function test() {
  try {
    console.log('Generating message...');
    const content = await generateMessage([]);
    console.log('Success!', content);
  } catch (error) {
    console.error('Failed!', error);
  }
}

test();
