var express = require('express');
var router = express.Router();
const favorite_tours = require('../controllers/ctrlFavorite_Tours');
router.get('/getAllFavorite_Tours', favorite_tours.getAllFavorite_Tours);
router.get('/getFavorite_ToursById', favorite_tours.getFavorite_ToursById);
router.post('/createFavorite_Tours', favorite_tours.createFavorite_Tours);
router.put('/updateFavorite_Tours', favorite_tours.updateFavorite_Tours);
router.delete('/deleteFavorite_Tours', favorite_tours.deleteFavorite_Tours);
module.exports = router;
