require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // There isn't a direct listModels in this SDK, but we can try to fetch a known one
    // or use the REST API via fetch to see what's happening.
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
      console.error('API Error:', data.error.message);
      if (data.error.status === 'INVALID_ARGUMENT') {
        console.error('Hint: Your API key might be invalid or for the wrong project.');
      }
    } else {
      console.log('Available models for your key:');
      data.models.forEach(m => console.log(`- ${m.name}`));
    }
  } catch (error) {
    console.error('Failed to list models:', error.message);
  }
}

listModels();
