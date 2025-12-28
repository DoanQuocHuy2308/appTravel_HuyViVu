var express = require('express');
var router = express.Router();
var { upload } = require('../middleware/upload');
const image_tour = require('../controllers/ctrlImage_Tour');
router.get('/getAllImage_Tour', image_tour.getAllImage_Tour);
router.get('/getImage_TourById', image_tour.getImage_TourById);
router.get('/getImage_TourByIdTour', image_tour.getImage_TourByIdTour);
router.post('/createImage_Tour', upload.single('image'), image_tour.createImage_Tour);
router.post('/createMultipleImage_Tour', upload.array('images', 20), image_tour.createMultipleImage_Tour); // Cho phép upload tối đa 10 ảnh
router.put('/updateImage_Tour', upload.single('image'), image_tour.updateImage_Tour);
router.delete('/deleteImage_Tour', image_tour.deleteImage_Tour);
module.exports = router;