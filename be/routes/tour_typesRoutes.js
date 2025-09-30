var express = require('express');
var router = express.Router();
const tour_types = require('../controllers/ctrlTour_Types');
router.get('/getAllTour_Types', tour_types.getAllTour_Types);
router.get('/getTour_TypesById', tour_types.getTour_TypesById);
router.post('/createTour_Types', tour_types.createTour_Types);
router.put('/updateTour_Types', tour_types.updateTour_Types);
router.delete('/deleteTour_Types', tour_types.deleteTour_Types);
module.exports = router;
