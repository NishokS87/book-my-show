const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createBooking,
  getBookings,
  getBooking,
  cancelBooking,
  getUserBookings
} = require('../controllers/bookingController');

router.use(protect);

router.route('/')
  .post(createBooking)
  .get(getBookings);

router.get('/user/my-bookings', getUserBookings);

router.route('/:id')
  .get(getBooking)
  .delete(cancelBooking);

module.exports = router;
