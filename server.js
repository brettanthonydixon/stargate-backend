import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

export async function main() {

  const client = ModelClient(
    endpoint,
    new AzureKeyCredential(token),
  );

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { role:"system", content: "You are a helpful assistant." },
        { role:"user", content: "What is the capital of France?" }
      ],
      temperature: 1.0,
      top_p: 1.0,
      model: model
    }
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  console.log(response.body.choices[0].message.content);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

//

require('dotenv').config(); // Loads variables from .env file
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Use middleware
app.use(cors()); // Allow requests from your Chrome extension
app.use(express.json()); // Allow the server to read JSON from requests

// Get secrets from environment variables
const API_KEY = process.env.GOOGLE_API_KEY;
const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;

// Define the /search endpoint
app.post('/search', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${query}`;

  try {
    const response = await axios.get(searchUrl);
    // Send Google's response back to the Chrome extension
    res.json(response.data); 
  } catch (error) {
    console.error('Error fetching from Google API:', error.message);
    res.status(500).json({ error: 'Failed to fetch search results from Google.' });
  }
});

app.listen(PORT, () => {
  console.log(`StarGate backend server running on http://localhost:${PORT}`);
});
