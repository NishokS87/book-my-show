const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide movie title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide movie description']
  },
  language: {
    type: String,
    required: true
  },
  genre: [{
    type: String,
    required: true
  }],
  duration: {
    type: Number, // in minutes
    required: [true, 'Please provide movie duration']
  },
  releaseDate: {
    type: Date,
    required: true
  },
  rating: {
    type: String,
    enum: ['U', 'UA', 'A', 'S'],
    required: true
  },
  posterUrl: {
    type: String,
    default: ''
  },
  trailerUrl: {
    type: String,
    default: ''
  },
  cast: [{
    name: String,
    role: String
  }],
  director: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Movie', movieSchema);
