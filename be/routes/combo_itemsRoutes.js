var express = require('express');
var router = express.Router();
const combo_items = require('../controllers/ctrlCombo_Items');
router.get('/getAllCombo_Items', combo_items.getAllCombo_Items);
router.get('/getCombo_ItemsById', combo_items.getCombo_ItemsById);
router.post('/createCombo_Items', combo_items.createCombo_Items);
router.put('/updateCombo_Items', combo_items.updateCombo_Items);
router.delete('/deleteCombo_Items', combo_items.deleteCombo_Items);
module.exports = router;
