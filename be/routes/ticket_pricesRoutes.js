var express = require('express');
var router = express.Router();
const ticket_prices = require('../controllers/ctrlTicket_Prices');
router.get('/getAllTicket_Prices', ticket_prices.getAllTicket_Prices);
router.get('/getTicket_PricesById', ticket_prices.getTicket_PricesById);
router.post('/createTicket_Prices', ticket_prices.createTicket_Prices);
router.put('/updateTicket_Prices', ticket_prices.updateTicket_Prices);
router.delete('/deleteTicket_Prices', ticket_prices.deleteTicket_Prices);
module.exports = router;
