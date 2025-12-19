const Booking = require('../models/Booking');
const Show = require('../models/Show');
const mongoose = require('mongoose');

// @desc    Create booking - ALWAYS SUCCEEDS (Project Mode - No seat conflicts)
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const { show: showId, seats: seatIds } = req.body;

    // Get show details
    const show = await Show.findById(showId)
      .populate('movie theater');

    if (!show) {
      return res.status(404).json({
        status: 'error',
        message: 'Show not found'
      });
    }

    // Collect seat information - NO AVAILABILITY CHECK
    const bookedSeats = [];
    let totalAmount = 0;

    for (const seatId of seatIds) {
      // Find seat info (even if booked by others)
      const seat = show.availableSeats.find(s => s.seatId === seatId);

      if (seat) {
        // Get pricing for seat type
        const pricing = show.pricing.find(p => p.seatType === seat.type);
        
        bookedSeats.push({
          row: seat.row,
          number: seat.number,
          seatType: seat.type, // Model expects 'seatType' not 'type'
          price: pricing ? pricing.price : 0
        });

        totalAmount += pricing ? pricing.price : 0;
      }
    }

    // Generate unique booking code
    const bookingCode = 'BMS' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Create booking - ALWAYS SUCCEEDS, bookingStatus = 'confirmed'
    const booking = await Booking.create({
      user: req.user.id,
      show: showId,
      movie: show.movie._id,
      theater: show.theater._id,
      seats: bookedSeats,
      totalSeats: bookedSeats.length,
      totalAmount,
      showDate: show.showDate,
      showTime: show.showTime,
      bookingCode: bookingCode, // Required field
      bookingStatus: 'confirmed', // Model uses 'bookingStatus' not 'status'
      paymentStatus: 'completed', // Mark as paid
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year (never expires)
    });

    // Mark seats as booked in show (visual feedback only)
    await Show.updateOne(
      { _id: showId },
      {
        $set: {
          'availableSeats.$[seat].status': 'booked'
        },
        $inc: { bookedSeats: bookedSeats.length }
      },
      {
        arrayFilters: [{ 'seat.seatId': { $in: seatIds } }]
      }
    );

    res.status(201).json({
      status: 'success',
      message: 'Booking confirmed successfully!',
      booking: booking
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create booking. Please try again.',
      error: error.message
    });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
exports.getBookings = async (req, res) => {
  try {
    let query = {};

    // Regular users can only see their own bookings
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('movie', 'title language')
      .populate('theater', 'name location')
      .populate('show', 'showDate showTime')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('movie', 'title language duration rating posterUrl')
      .populate('theater', 'name location')
      .populate('show', 'showDate showTime screenNumber');

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }

    // Make sure user owns the booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access this booking'
      });
    }

    res.status(200).json({
      status: 'success',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }

    // Make sure user owns the booking
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        status: 'error',
        message: 'Booking is already cancelled'
      });
    }

    // Release seats in show
    const show = await Show.findById(booking.show);
    
    if (show) {
      for (const seat of booking.seats) {
        const seatIndex = show.availableSeats.findIndex(
          s => s.row === seat.row && s.number === seat.number
        );
        
        if (seatIndex !== -1) {
          show.availableSeats[seatIndex].status = 'available';
        }
      }

      show.bookedSeats -= booking.totalSeats;
      await show.save();
    }

    booking.bookingStatus = 'cancelled';
    await booking.save();

    res.status(200).json({
      status: 'success',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/user/my-bookings
// @access  Private
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('movie', 'title language posterUrl')
      .populate('theater', 'name location')
      .populate('show', 'showDate showTime')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
