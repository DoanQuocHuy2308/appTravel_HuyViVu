var express = require('express');
var router = express.Router();
const user_points = require('../controllers/ctrlUser_Points');
router.get('/getAllUser_Points', user_points.getAllUser_Points);
router.get('/getUser_PointsById', user_points.getUser_PointsById);
router.post('/createUser_Points', user_points.createUser_Points);
router.put('/updateUser_Points', user_points.updateUser_Points);
router.delete('/deleteUser_Points', user_points.deleteUser_Points);
module.exports = router;
