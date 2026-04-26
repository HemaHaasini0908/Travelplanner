const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function callGroq(prompt) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a travel expert. You MUST respond with ONLY a valid JSON object. No markdown, no backticks, no extra text. Just pure JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    })
  });

  const data = await response.json();

  if (!data.choices || !data.choices[0]) {
    throw new Error('No response from Groq');
  }

  return data.choices[0].message.content;
}

router.post('/generate', async (req, res) => {
  try {
    const { vibe, budget, duration } = req.body;

    const prompt = `Give me a travel plan for someone who wants a ${vibe} trip for ${duration} days with a budget of ${budget}.

Return a JSON object with exactly these fields:
{
  "destinations": [
    {"name": "City, Country", "description": "why it fits", "highlight": "top activity"},
    {"name": "City, Country", "description": "why it fits", "highlight": "top activity"},
    {"name": "City, Country", "description": "why it fits", "highlight": "top activity"}
  ],
  "itinerary": {
    "destination": "chosen city",
    "days": [
      {"day": 1, "theme": "theme", "morning": "activity", "afternoon": "activity", "evening": "activity"}
    ]
  },
  "foodSpots": [
    {"name": "place name", "type": "cuisine type", "description": "what to eat"},
    {"name": "place name", "type": "cuisine type", "description": "what to eat"},
    {"name": "place name", "type": "cuisine type", "description": "what to eat"},
    {"name": "place name", "type": "cuisine type", "description": "what to eat"}
  ]
}

Make exactly ${duration} days in the itinerary.days array.`;

    const aiResponse = await callGroq(prompt);
    console.log('Raw Groq response:', aiResponse);

    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch (e) {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Could not parse response as JSON');
      parsed = JSON.parse(jsonMatch[0]);
    }

    // Force foodSpots to be proper array of objects
    let foodSpots = parsed.foodSpots;
    if (typeof foodSpots === 'string') {
      foodSpots = JSON.parse(foodSpots);
    }
    if (!Array.isArray(foodSpots)) {
      foodSpots = [];
    }

    // Force destinations to be proper array
    let destinations = parsed.destinations;
    if (typeof destinations === 'string') {
      destinations = JSON.parse(destinations);
    }
    if (!Array.isArray(destinations)) {
      destinations = [];
    }

    const trip = new Trip({
      vibe,
      budget,
      duration,
      destinations,
      itinerary: parsed.itinerary,
      foodSpots
    });

    await trip.save();
    res.json({ tripId: trip._id, destinations, itinerary: parsed.itinerary, foodSpots });

  } catch (err) {
    console.error('Generate error:', err.message);
    res.status(500).json({ error: 'Failed to generate travel plan. Check your Groq API key.' });
  }
});

// Get all past trips
router.get('/history', async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 }).limit(10);
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Get single trip
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: 'Trip not found' });
  }
});


// Generate plan for specific destination
router.post('/destination', async (req, res) => {
  try {
    const { destination, vibe, budget, duration } = req.body;

    const prompt = `Give me a detailed travel plan for ${destination} for someone who wants a ${vibe} trip for ${duration} days with a budget of ${budget}.

Return a JSON object with exactly these fields:
{
  "itinerary": {
    "destination": "${destination}",
    "days": [
      {"day": 1, "theme": "theme", "morning": "activity", "afternoon": "activity", "evening": "activity"}
    ]
  },
  "foodSpots": [
    {"name": "place name", "type": "cuisine type", "description": "what to eat"},
    {"name": "place name", "type": "cuisine type", "description": "what to eat"},
    {"name": "place name", "type": "cuisine type", "description": "what to eat"},
    {"name": "place name", "type": "cuisine type", "description": "what to eat"}
  ]
}

Make exactly ${duration} days in the itinerary.days array.`;

    const aiResponse = await callGroq(prompt);

    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Could not parse response');
      parsed = JSON.parse(jsonMatch[0]);
    }

    res.json(parsed);

  } catch (err) {
    console.error('Destination error:', err.message);
    res.status(500).json({ error: 'Failed to generate destination plan' });
  }
});


module.exports = router;