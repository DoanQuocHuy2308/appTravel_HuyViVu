var express = require('express');
var router = express.Router();
const reviews = require('../controllers/ctrlReviews');
router.get('/getAllReviews', reviews.getAllReviews);
router.get('/getReviewsById', reviews.getReviewsById);
router.post('/createReviews', reviews.createReviews);
router.put('/updateReviews', reviews.updateReviews);
router.delete('/deleteReviews', reviews.deleteReviews);
module.exports = router;
