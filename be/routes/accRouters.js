var express = require('express');
var router = express.Router();
var Acc = require('../controllers/ctrlAcc');

router.post('/login', Acc.login);
router.post('/regrister', Acc.register);
module.exports = router;