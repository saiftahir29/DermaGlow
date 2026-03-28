require('dotenv').config();
const { openai } = require('./utils/openGpt');

async function testGroq() {
  console.log('Testing Groq SDK integration...');
  try {
    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a helpful skincare assistant." },
        { role: "user", content: "What is a good morning routine for oily skin?" }
      ],
      temperature: 0.7,
    });
    console.log("SUCCESS!");
    console.log("Response:", response.choices[0].message.content);
  } catch (err) {
    console.error("ERROR:");
    console.error(err);
  }
}

testGroq();
