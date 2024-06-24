const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/save', adminController.registerAdmin);

router.get('/verify-password', adminController.verifyPassword);

router.post('/change-password', adminController.changePassword);

module.exports = router;

