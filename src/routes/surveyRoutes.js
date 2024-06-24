const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');

router.post('/save', surveyController.saveSurvey);

router.get('/get', surveyController.getSurvey);

router.get('/get-csv', surveyController.getSurveyCsv);

router.get('/get-all', surveyController.getAllSurvey);

router.get('/get-all-csv', surveyController.getAllSurveyCsv);

router.get('/get-user-marks', surveyController.getUserSurveyMarks);

router.get('/get-user-survey', surveyController.getUserSurvey);

router.post('/update', surveyController.updateSurvey);

router.post('/delete', surveyController.deleteSurvey);

module.exports = router;