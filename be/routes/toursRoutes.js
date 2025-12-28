var express = require('express');
var router = express.Router();
const tours = require('../controllers/ctrlTours');
const { upload } = require('../middleware/upload');

router.get('/getAllTours', tours.getAllTours);
router.get('/getToursById', tours.getToursById);
router.get('/getAllTourByTime', tours.getAllTourByTime);
router.get('/getAllTourByTransportation', tours.getAllTourByTransportation);
router.post('/createTours', upload.array('images', 10), tours.createTours); 
router.put('/updateTours', upload.array('images', 10), tours.updateTours);
router.delete('/deleteTours', tours.deleteTours);
module.exports = router;
