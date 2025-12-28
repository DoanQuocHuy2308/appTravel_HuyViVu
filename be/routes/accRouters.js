var express = require('express');
var router = express.Router();
var Acc = require('../controllers/ctrlAcc');
var uploads = require('../middleware/upload');

router.post('/login', Acc.login);
router.post('/register', uploads.upload.single('image'), Acc.register);
router.post('/check-email', Acc.checkEmail);
module.exports = router;