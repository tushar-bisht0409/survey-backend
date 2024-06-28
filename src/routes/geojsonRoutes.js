const express = require('express');
const router = express.Router();
const geojsonController = require('../controllers/geojsonController');

router.post('/save', geojsonController.saveGeojson);

router.get('/get-user', geojsonController.getUserGeojson);

module.exports = router;