require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log('Testing gemini-1.5-flash...');
    const result = await model.generateContent("Hello");
    console.log('Success!', result.response.text());
  } catch (error) {
    console.error('gemini-1.5-flash failed:', error.message);
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      console.log('Testing gemini-pro...');
      const result = await model.generateContent("Hello");
      console.log('Success!', result.response.text());
    } catch (err2) {
      console.error('gemini-pro failed:', err2.message);
    }
  }
}

test();
