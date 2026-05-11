const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Dynamic model selection happens inside generateMessage

const generateMessage = async (usedMessages = []) => {
  const prompt = `
You are writing a short, heartfelt daily message from a Muslim husband named Sahed to his wife Tamanna. The message must:
- Be between 20 and 100 words
- Be written in natural Bangla (use Bangla script, not transliteration) or natural English. Use one language only at a time.
- Rotate naturally between these themes: Islamic dua or reminder for a wife, appreciation for her efforts, expressing love and care, words that lift her mood and make her smile
- Feel personal, warm, and genuine — not generic or AI-sounding
- Never start with "Assalamu Alaikum" every single time — vary the opening
- Do NOT repeat or closely resemble any of these past messages: ${JSON.stringify(usedMessages)}
- Return only the message text, nothing else
  `.trim();

  // Get models from .env or use a default list
  const modelsToTry = (process.env.GEMINI_MODELS || "").split(',').map(m => m.trim()).filter(m => m);
  
  if (modelsToTry.length === 0) {
    throw new Error("No models configured in GEMINI_MODELS .env variable");
  }
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`Attempting to generate message with ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      if (text) {
        console.log(`Successfully generated message using ${modelName}`);
        return text;
      }
    } catch (error) {
      console.error(`${modelName} failed:`, error.message);
      if (modelName === modelsToTry[modelsToTry.length - 1]) {
        throw error; // Rethrow if last model fails
      }
    }
  }
};

module.exports = { generateMessage };
