var express = require('express');
var router = express.Router();
const image_tour = require('../controllers/ctrlImage_Tour');
router.get('/getAllImage_Tour', image_tour.getAllImage_Tour);
router.get('/getImage_TourById', image_tour.getImage_TourById);
router.post('/createImage_Tour', image_tour.createImage_Tour);
router.put('/updateImage_Tour', image_tour.updateImage_Tour);
router.delete('/deleteImage_Tour', image_tour.deleteImage_Tour);
module.exports = router;
