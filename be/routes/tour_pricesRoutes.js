var express = require('express');
var router = express.Router();
const tour_prices = require('../controllers/ctrlTour_Prices');
router.get('/getAllTour_Prices', tour_prices.getAllTour_Prices);
router.get('/getTour_PricesById', tour_prices.getTour_PricesById);
router.post('/createTour_Prices', tour_prices.createTour_Prices);
router.put('/updateTour_Prices', tour_prices.updateTour_Prices);
router.delete('/deleteTour_Prices', tour_prices.deleteTour_Prices);
module.exports = router;
