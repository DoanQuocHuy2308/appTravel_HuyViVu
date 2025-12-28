var express = require('express');
var router = express.Router();
const tour_ticket_prices = require('../controllers/ctrlTour_Ticket_Prices');
router.get('/getAllTour_Ticket_Prices', tour_ticket_prices.getAllTour_Ticket_Prices);
router.get('/getTour_Ticket_PricesById', tour_ticket_prices.getTour_Ticket_PricesById);
router.post('/createTour_Ticket_Prices', tour_ticket_prices.createTour_Ticket_Prices);
router.put('/updateTour_Ticket_Prices', tour_ticket_prices.updateTour_Ticket_Prices);
router.delete('/deleteTour_Ticket_Prices', tour_ticket_prices.deleteTour_Ticket_Prices);
module.exports = router;
