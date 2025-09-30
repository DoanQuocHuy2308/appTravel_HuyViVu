var express = require('express');
var router = express.Router();
const contact = require('../controllers/ctrlContact');
router.get('/getAllContact', contact.getAllContact);
router.get('/getContactById', contact.getContactById);
router.post('/createContact', contact.createContact);
router.put('/updateContact', contact.updateContact);
router.delete('/deleteContact', contact.deleteContact);
module.exports = router;
