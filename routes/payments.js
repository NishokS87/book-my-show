const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createPaymentIntent,
  confirmPayment,
  getPaymentStatus
} = require('../controllers/paymentController');

router.use(protect);

router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.get('/status/:bookingId', getPaymentStatus);

module.exports = router;
