var express = require('express');
var router = express.Router();
const bookings = require('../controllers/ctrlBookings');
router.get('/getAllBookings', bookings.getAllBookings);
router.get('/getBookingsById', bookings.getBookingsById);
router.post('/createBookings', bookings.createBookings);
router.put('/updateBookings', bookings.updateBookings);
router.delete('/deleteBookings', bookings.deleteBookings);
module.exports = router;
