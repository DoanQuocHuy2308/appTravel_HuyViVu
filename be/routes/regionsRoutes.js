var express = require('express');
var router = express.Router();
const regions = require('../controllers/ctrlRegions');
router.get('/getAllRegions', regions.getAllRegions);
router.get('/getRegionsById', regions.getRegionsById);
router.post('/createRegions', regions.createRegions);
router.put('/updateRegions', regions.updateRegions);
router.delete('/deleteRegions', regions.deleteRegions);
module.exports = router;
