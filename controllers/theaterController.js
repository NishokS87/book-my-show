const Theater = require('../models/Theater');

// @desc    Get all theaters
// @route   GET /api/theaters
// @access  Public
exports.getTheaters = async (req, res) => {
  try {
    const theaters = await Theater.find({ isActive: true }).populate('owner', 'name email');

    res.status(200).json({
      status: 'success',
      count: theaters.length,
      data: theaters
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get single theater
// @route   GET /api/theaters/:id
// @access  Public
exports.getTheater = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id).populate('owner', 'name email');

    if (!theater) {
      return res.status(404).json({
        status: 'error',
        message: 'Theater not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: theater
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Create theater
// @route   POST /api/theaters
// @access  Private/Admin/Theater-Owner
exports.createTheater = async (req, res) => {
  try {
    // Set owner to logged in user if theater-owner
    if (req.user.role === 'theater-owner') {
      req.body.owner = req.user.id;
    }

    const theater = await Theater.create(req.body);

    res.status(201).json({
      status: 'success',
      data: theater
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update theater
// @route   PUT /api/theaters/:id
// @access  Private/Admin/Theater-Owner
exports.updateTheater = async (req, res) => {
  try {
    let theater = await Theater.findById(req.params.id);

    if (!theater) {
      return res.status(404).json({
        status: 'error',
        message: 'Theater not found'
      });
    }

    // Make sure user is theater owner or admin
    if (theater.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this theater'
      });
    }

    theater = await Theater.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: theater
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Delete theater
// @route   DELETE /api/theaters/:id
// @access  Private/Admin/Theater-Owner
exports.deleteTheater = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);

    if (!theater) {
      return res.status(404).json({
        status: 'error',
        message: 'Theater not found'
      });
    }

    // Make sure user is theater owner or admin
    if (theater.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this theater'
      });
    }

    await theater.deleteOne();

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

// @desc    Get theaters by location
// @route   GET /api/theaters/location/:city
// @access  Public
exports.getTheatersByLocation = async (req, res) => {
  try {
    const theaters = await Theater.find({
      'location.city': { $regex: req.params.city, $options: 'i' },
      isActive: true
    });

    res.status(200).json({
      status: 'success',
      count: theaters.length,
      data: theaters
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
