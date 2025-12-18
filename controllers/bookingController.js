const Booking = require('../models/Booking');
const Show = require('../models/Show');
const mongoose = require('mongoose');

// @desc    Create booking with optimized seat allocation
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { show: showId, seats: seatIds } = req.body;

    // Get show details with lock to prevent race conditions
    const show = await Show.findById(showId)
      .populate('movie theater')
      .session(session);

    if (!show) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        status: 'error',
        message: 'Show not found'
      });
    }

    if (!show.isActive) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: 'error',
        message: 'Show is not active'
      });
    }

    // Validate and collect seat information
    const bookedSeats = [];
    let totalAmount = 0;
    const unavailableSeats = [];

    for (const seatId of seatIds) {
      // Find seat in available seats
      const seat = show.availableSeats.find(s => s.seatId === seatId);

      if (!seat) {
        unavailableSeats.push(seatId);
        continue;
      }

      // Check if seat is available
      if (seat.status !== 'available') {
        unavailableSeats.push(`${seat.row}${seat.number} (${seat.status})`);
        continue;
      }

      // Get pricing for seat type
      const pricing = show.pricing.find(p => p.seatType === seat.type);
      
      bookedSeats.push({
        seatId: seat.seatId,
        row: seat.row,
        number: seat.number,
        type: seat.type,
        price: pricing.price
      });

      totalAmount += pricing.price;
    }

    // If any seats are unavailable, abort transaction
    if (unavailableSeats.length > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: 'error',
        message: `The following seats are not available: ${unavailableSeats.join(', ')}. Please select different seats.`
      });
    }

    // Atomically update seat status to 'blocked' to prevent double booking
    const updateResult = await Show.updateOne(
      { 
        _id: showId,
        'availableSeats.seatId': { $in: seatIds },
        'availableSeats.status': 'available'
      },
      {
        $set: {
          'availableSeats.$[seat].status': 'blocked'
        },
        $inc: { bookedSeats: bookedSeats.length }
      },
      {
        arrayFilters: [{ 'seat.seatId': { $in: seatIds } }],
        session
      }
    );

    // Check if update was successful (all seats were available)
    if (updateResult.modifiedCount === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: 'error',
        message: 'One or more seats were just booked by another user. Please select different seats.'
      });
    }

    // Create booking
    const booking = await Booking.create([{
      user: req.user.id,
      show: showId,
      movie: show.movie._id,
      theater: show.theater._id,
      seats: bookedSeats,
      totalSeats: bookedSeats.length,
      totalAmount,
      showDate: show.showDate,
      showTime: show.showTime,
      status: 'pending' // Will be confirmed after payment
    }], { session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      status: 'success',
      message: 'Seats blocked successfully. Complete payment within 10 minutes.',
      booking: booking[0]
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
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
