const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);


router.post('/registerResident', authController.registerResident);
router.post('/loginResident', authController.loginResident);

router.post('/registerBarangay', authController.registerBarangay);
router.post('/loginBarangay', authController.loginBarangay);
module.exports = router;