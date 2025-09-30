var express = require('express');
var router = express.Router();
const services = require('../controllers/ctrlServices');
router.get('/getAllServices', services.getAllServices);
router.get('/getServicesById', services.getServicesById);
router.post('/createServices', services.createServices);
router.put('/updateServices', services.updateServices);
router.delete('/deleteServices', services.deleteServices);
module.exports = router;
