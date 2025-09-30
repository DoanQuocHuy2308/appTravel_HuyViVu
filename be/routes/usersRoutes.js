var express = require('express');
var router = express.Router();
const users = require('../controllers/ctrlUsers');
router.get('/getAllUsers', users.getAllUsers);
router.get('/getUsersById', users.getUsersById);
router.post('/createUsers', users.createUsers);
router.put('/updateUsers', users.updateUsers);
router.delete('/deleteUsers', users.deleteUsers);
module.exports = router;
