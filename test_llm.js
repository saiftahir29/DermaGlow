const axios = require('axios');
const jwt = require('jsonwebtoken');

// 1. Generate a mock JWT for a test user
const mockUserId = '65fa1a2b3c4d5e6f7a8b9c0d'; // Mock MongoDB ObjectId
const secret = process.env.SECRET || 'default_secret';

const token = jwt.stringify({ id: mockUserId }, secret); // Note: jwt.sign is needed usually, we'll try something simpler

// Instead of setting up a full passport mockup, we can just test the Groq SDK directly
const { openai } = require('./server/utils/openGpt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

async function testGroq() {
  console.log('Testing Groq SDK integration...');
  try {
    const response = await openai.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "You are a helpful skincare assistant." },
        { role: "user", content: "What is a good morning routine for oily skin?" }
      ],
      temperature: 0.7,
    });
    console.log("SUCCESS!");
    console.log("Response:", response.choices[0].message.content);
  } catch (err) {
    console.error("ERROR:", err.message);
    if (err.response) {
      console.error(err.response.data);
    }
  }
}

testGroq();
