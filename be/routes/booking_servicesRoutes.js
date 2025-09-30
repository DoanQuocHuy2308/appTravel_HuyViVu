var express = require('express');
var router = express.Router();
const booking_services = require('../controllers/ctrlBooking_Services');
router.get('/getAllBooking_Services', booking_services.getAllBooking_Services);
router.get('/getBooking_ServicesById', booking_services.getBooking_ServicesById);
router.post('/createBooking_Services', booking_services.createBooking_Services);
router.put('/updateBooking_Services', booking_services.updateBooking_Services);
router.delete('/deleteBooking_Services', booking_services.deleteBooking_Services);
module.exports = router;
