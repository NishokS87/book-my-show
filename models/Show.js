const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true
  },
  screenNumber: {
    type: Number,
    required: true
  },
  showDate: {
    type: Date,
    required: true
  },
  showTime: {
    type: String, // Format: "HH:MM" (e.g., "14:30")
    required: true
  },
  language: {
    type: String,
    required: true
  },
  format: {
    type: String,
    enum: ['2D', '3D', 'IMAX', '4DX'],
    default: '2D'
  },
  pricing: [{
    seatType: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  availableSeats: [{
    row: String,
    number: Number,
    seatType: String,
    status: {
      type: String,
      enum: ['available', 'booked', 'blocked'],
      default: 'available'
    }
  }],
  totalSeats: {
    type: Number,
    required: true
  },
  bookedSeats: {
    type: Number,
    default: 0
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

// Index for efficient queries
showSchema.index({ movie: 1, theater: 1, showDate: 1, showTime: 1 });

module.exports = mongoose.model('Show', showSchema);
