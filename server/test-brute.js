require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('Listing models...');
    // This might not work with the current SDK version directly without a specific method, 
    // but we can try to access the underlying API if needed.
    // Actually, let's just try gemini-1.5-flash-latest and gemini-1.5-pro-latest.
    
    const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-1.5-pro-latest', 'gemini-pro'];
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        await model.generateContent("test");
        console.log(`Model ${m} works!`);
        return;
      } catch (e) {
        console.log(`Model ${m} failed: ${e.message}`);
      }
    }
  } catch (error) {
    console.error('Test failed!', error);
  }
}

test();
