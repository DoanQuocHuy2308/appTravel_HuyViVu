var express = require('express');
var router = express.Router();
const tours = require('../controllers/ctrlTours');
router.get('/getAllTours', tours.getAllTours);
router.get('/getToursById', tours.getToursById);
router.post('/createTours', tours.createTours);
router.put('/updateTours', tours.updateTours);
router.delete('/deleteTours', tours.deleteTours);
module.exports = router;
