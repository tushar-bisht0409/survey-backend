const express = require('express');
const router = express.Router();
const markedpointController = require('../controllers/markedpointController');

router.post('/save', markedpointController.saveMarkedpoint);

router.get('/get', markedpointController.getMarkedpoint);

router.get('/get-list', markedpointController.getMarkedpointList);

module.exports = router;