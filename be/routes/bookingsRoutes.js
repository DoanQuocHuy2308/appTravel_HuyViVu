var express = require('express');
var router = express.Router();
const bookings = require('../controllers/ctrlBookings');

// CRUD operations
router.get('/getAllBookings', bookings.getAllBookings);
router.get('/getBookingsById', bookings.getBookingsById);
router.post('/booking', bookings.booking);
router.put('/updateBooking', bookings.updateBooking);
router.delete('/deleteBooking', bookings.deleteBooking);
router.get('/getBookingsByUserId', bookings.getBookingsByUserId);
router.get('/getBookingsByTourId', bookings.getBookingsByTourId);
router.get('/getBookingsByStatus', bookings.getBookingsByStatus);
router.get('/getBookingsByDateRange', bookings.getBookingsByDateRange);

module.exports = router;
