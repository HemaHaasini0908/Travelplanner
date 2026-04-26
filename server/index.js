const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const axios = require("axios");

dotenv.config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());



// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Routes
app.use('/api/trips', require('./routes/trips'));
app.post("/api/chat", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [
          { role: "user", content: req.body.message }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      reply: response.data.choices[0].message.content
    });

  } catch (err) {
    console.error("🔥 GROQ ERROR:", err.response?.data || err.message);
    res.status(500).send(err.message);
  }
});

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));