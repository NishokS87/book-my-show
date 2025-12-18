const Show = require('../models/Show');
const Theater = require('../models/Theater');

// @desc    Get all shows
// @route   GET /api/shows
// @access  Public
exports.getShows = async (req, res) => {
  try {
    const { date, isActive } = req.query;
    
    let query = {};
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.showDate = { $gte: startDate, $lte: endDate };
    }
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const shows = await Show.find(query)
      .populate('movie', 'title language genre duration rating posterUrl')
      .populate('theater', 'name location')
      .sort({ showDate: 1, showTime: 1 });

    res.status(200).json({
      status: 'success',
      count: shows.length,
      data: shows
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get single show
// @route   GET /api/shows/:id
// @access  Public
exports.getShow = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie')
      .populate('theater');

    if (!show) {
      return res.status(404).json({
        status: 'error',
        message: 'Show not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: show
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Create show
// @route   POST /api/shows
// @access  Private/Admin/Theater-Owner
exports.createShow = async (req, res) => {
  try {
    const theater = await Theater.findById(req.body.theater);

    if (!theater) {
      return res.status(404).json({
        status: 'error',
        message: 'Theater not found'
      });
    }

    // Get screen details
    const screen = theater.screens.find(s => s.screenNumber === req.body.screenNumber);
    
    if (!screen) {
      return res.status(404).json({
        status: 'error',
        message: 'Screen not found'
      });
    }

    // Initialize available seats from theater screen layout
    const availableSeats = [];
    screen.seatLayout.seatTypes.forEach(seatType => {
      seatType.seats.forEach(seat => {
        availableSeats.push({
          row: seat.row,
          number: seat.number,
          seatType: seatType.type,
          status: 'available'
        });
      });
    });

    req.body.availableSeats = availableSeats;
    req.body.totalSeats = screen.totalSeats;

    const show = await Show.create(req.body);

    res.status(201).json({
      status: 'success',
      data: show
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update show
// @route   PUT /api/shows/:id
// @access  Private/Admin/Theater-Owner
exports.updateShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!show) {
      return res.status(404).json({
        status: 'error',
        message: 'Show not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: show
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Delete show
// @route   DELETE /api/shows/:id
// @access  Private/Admin/Theater-Owner
exports.deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);

    if (!show) {
      return res.status(404).json({
        status: 'error',
        message: 'Show not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get shows by movie
// @route   GET /api/shows/movie/:movieId
// @access  Public
exports.getShowsByMovie = async (req, res) => {
  try {
    const shows = await Show.find({
      movie: req.params.movieId,
      isActive: true,
      showDate: { $gte: new Date() }
    })
      .populate('theater', 'name location')
      .sort({ showDate: 1, showTime: 1 });

    res.status(200).json({
      status: 'success',
      count: shows.length,
      data: shows
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get shows by theater
// @route   GET /api/shows/theater/:theaterId
// @access  Public
exports.getShowsByTheater = async (req, res) => {
  try {
    const shows = await Show.find({
      theater: req.params.theaterId,
      isActive: true,
      showDate: { $gte: new Date() }
    })
      .populate('movie', 'title language genre duration rating posterUrl')
      .sort({ showDate: 1, showTime: 1 });

    res.status(200).json({
      status: 'success',
      count: shows.length,
      data: shows
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get shows by movie and city
// @route   GET /api/shows/movie/:movieId/city/:city
// @access  Public
exports.getShowsByMovieAndCity = async (req, res) => {
  try {
    // Find theaters in the city
    const theaters = await Theater.find({
      'location.city': { $regex: req.params.city, $options: 'i' },
      isActive: true
    });

    const theaterIds = theaters.map(t => t._id);

    const shows = await Show.find({
      movie: req.params.movieId,
      theater: { $in: theaterIds },
      isActive: true,
      showDate: { $gte: new Date() }
    })
      .populate('theater', 'name location')
      .sort({ showDate: 1, showTime: 1 });

    res.status(200).json({
      status: 'success',
      count: shows.length,
      data: shows
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
