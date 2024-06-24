const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/save', userController.saveUser);

router.get('/get', userController.getUser);

router.get('/get-all', userController.getAllUser);

router.get('/verify-password', userController.verifyPassword);

router.post('/update', userController.updateUser);

router.post('/update-active', userController.updateActiveStatus);

router.post('/delete', userController.deleteUser);

module.exports = router;