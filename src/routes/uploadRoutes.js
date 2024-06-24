const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const uploadFileMiddleware = require('../middlewares/uploadFileMiddleware');

router.post('/', uploadFileMiddleware.uploadFile.single('file'), uploadController.uploadFile);

module.exports = router;