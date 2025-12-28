var express = require('express');
var router = express.Router();
const emailController = require('../controllers/ctrlEmail');

// Email routes
router.post('/send-booking-confirmation', emailController.sendBookingConfirmation);
router.post('/send-booking-update', emailController.sendBookingUpdate);
router.post('/send-booking-cancellation', emailController.sendBookingCancellation);

module.exports = router;
