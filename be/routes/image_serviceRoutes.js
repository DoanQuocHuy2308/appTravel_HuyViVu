var express = require('express');
var router = express.Router();
const image_service = require('../controllers/ctrlImage_Service');
router.get('/getAllImage_Service', image_service.getAllImage_Service);
router.get('/getImage_ServiceById', image_service.getImage_ServiceById);
router.post('/createImage_Service', image_service.createImage_Service);
router.put('/updateImage_Service', image_service.updateImage_Service);
router.delete('/deleteImage_Service', image_service.deleteImage_Service);
module.exports = router;
