const mongoose = require('mongoose');

const foodSpotSchema = new mongoose.Schema({
  name: String,
  type: String,
  description: String
}, { _id: false });

const destinationSchema = new mongoose.Schema({
  name: String,
  description: String,
  highlight: String
}, { _id: false });

const daySchema = new mongoose.Schema({
  day: Number,
  theme: String,
  morning: String,
  afternoon: String,
  evening: String
}, { _id: false });

const TripSchema = new mongoose.Schema({
  vibe: { type: String, required: true },
  budget: { type: String, required: true },
  duration: { type: Number, required: true },
  destinations: [destinationSchema],
  itinerary: { type: Object },
  foodSpots: [foodSpotSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trip', TripSchema);