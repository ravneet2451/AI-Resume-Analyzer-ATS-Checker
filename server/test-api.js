const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function testAPI() {
  console.log('Testing Gemini API...\n');
  
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
    console.log('❌ API key not found in .env file');
    console.log('Please add your API key to server/.env file');
    return;
  }

  console.log(`✅ API key found: ${API_KEY.substring(0, 10)}...`);
  
  // Test 1: List available models
  console.log('\n--- Test 1: Listing available models ---');
  try {
    const listResponse = await axios.get(
      `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`
    );
    console.log('Available models:');
    listResponse.data.models?.forEach(model => {
      console.log(`  - ${model.name}`);
    });
  } catch (error) {
    console.log(`❌ Error listing models: ${error.response?.data?.error?.message || error.message}`);
  }

  // Test 2: Try a simple generation request
  console.log('\n--- Test 2: Simple generation request ---');
  const testModel = 'gemini-1.5-flash';
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/${testModel}:generateContent?key=${API_KEY}`,
      {
        contents: [{ parts: [{ text: 'Say "Hello World" in exactly 2 words' }] }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 50,
        }
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('✅ Success!');
    console.log('Response:', response.data?.candidates?.[0]?.content?.parts?.[0]?.text);
  } catch (error) {
    console.log(`❌ Error: ${error.response?.status}`);
    console.log('Message:', error.response?.data?.error?.message || error.message);
  }
}

testAPI();
