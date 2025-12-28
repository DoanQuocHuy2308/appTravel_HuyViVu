var express = require('express');
var router = express.Router();
const category_service = require('../controllers/ctrlCategory_Service');
router.get('/getAllCategory_Service', category_service.getAllCategory_Service);
router.get('/getCategory_ServiceById', category_service.getCategory_ServiceById);
router.post('/createCategory_Service', category_service.createCategory_Service);
router.put('/updateCategory_Service', category_service.updateCategory_Service);
router.delete('/deleteCategory_Service', category_service.deleteCategory_Service);
module.exports = router;
