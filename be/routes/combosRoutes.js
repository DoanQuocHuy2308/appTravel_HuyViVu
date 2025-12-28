var express = require('express');
var router = express.Router();
const combos = require('../controllers/ctrlCombos');
router.get('/getAllCombos', combos.getAllCombos);
router.get('/getCombosById', combos.getCombosById);
router.post('/createCombos', combos.createCombos);
router.put('/updateCombos', combos.updateCombos);
router.delete('/deleteCombos', combos.deleteCombos);
module.exports = router;
