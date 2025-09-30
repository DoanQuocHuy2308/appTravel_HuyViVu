var express = require('express');
var router = express.Router();
const promotions = require('../controllers/ctrlPromotions');
router.get('/getAllPromotions', promotions.getAllPromotions);
router.get('/getPromotionsById', promotions.getPromotionsById);
router.post('/createPromotions', promotions.createPromotions);
router.put('/updatePromotions', promotions.updatePromotions);
router.delete('/deletePromotions', promotions.deletePromotions);
module.exports = router;
