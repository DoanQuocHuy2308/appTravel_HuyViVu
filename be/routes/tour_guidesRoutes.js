var express = require('express');
var router = express.Router();
const tour_guides = require('../controllers/ctrlTour_Guides');
router.get('/getAllTour_Guides', tour_guides.getAllTour_Guides);
router.get('/getTour_GuidesById', tour_guides.getTour_GuidesById);
router.post('/createTour_Guides', tour_guides.createTour_Guides);
router.put('/updateTour_Guides', tour_guides.updateTour_Guides);
router.delete('/deleteTour_Guides', tour_guides.deleteTour_Guides);
module.exports = router;
