var express = require('express');
var router = express.Router();
const locations = require('../controllers/ctrlLocations');
router.get('/getAllLocations', locations.getAllLocations);
router.get('/getLocationsById', locations.getLocationsById);
router.post('/createLocations', locations.createLocations);
router.put('/updateLocations', locations.updateLocations);
router.delete('/deleteLocations', locations.deleteLocations);
module.exports = router;
