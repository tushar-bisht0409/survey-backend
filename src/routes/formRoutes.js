const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');

router.post('/save', formController.saveForm);

router.get('/get', formController.getForm);

module.exports = router;

