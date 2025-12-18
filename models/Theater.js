const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide theater name'],
    trim: true
  },
  location: {
    city: {
      type: String,
      required: true
    },
    area: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  screens: [{
    screenNumber: {
      type: Number,
      required: true
    },
    screenName: {
      type: String,
      required: true
    },
    totalSeats: {
      type: Number,
      required: true
    },
    seatLayout: {
      rows: Number,
      seatsPerRow: Number,
      seatTypes: [{
        type: {
          type: String, // 'premium', 'gold', 'silver'
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        seats: [{
          row: String,
          number: Number
        }]
      }]
    }
  }],
  facilities: [{
    type: String // 'Parking', 'Food Court', 'M-Ticket', etc.
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

module.exports = mongoose.model('Theater', theaterSchema);
