var express = require('express');
var router = express.Router();
const tour_schedule = require('../controllers/ctrlTour_Schedule');
router.get('/getAllTour_Schedule', tour_schedule.getAllTour_Schedule);
router.get('/getTour_ScheduleById', tour_schedule.getTour_ScheduleById);
router.post('/createTour_Schedule', tour_schedule.createTour_Schedule);
router.put('/updateTour_Schedule', tour_schedule.updateTour_Schedule);
router.delete('/deleteTour_Schedule', tour_schedule.deleteTour_Schedule);
module.exports = router;
