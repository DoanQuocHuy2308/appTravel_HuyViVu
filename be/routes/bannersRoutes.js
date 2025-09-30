var express = require('express');
var router = express.Router();
const banners = require('../controllers/ctrlBanners');
router.get('/getAllBanners', banners.getAllBanners);
router.get('/getBannersById', banners.getBannersById);
router.post('/createBanners', banners.createBanners);
router.put('/updateBanners', banners.updateBanners);
router.delete('/deleteBanners', banners.deleteBanners);
module.exports = router;
