const express = require('express');
const residentController = require('../controllers/residentController');
const router = express.Router();

// Route to get all users
router.get('/users', residentController.getallResident);
// Route to get resident by user ID
router.get('/user/:userId', residentController.getResidentByUserId);
// Route to delete a user by ID
router.delete('/users/:id', residentController.deleteResident);

// Route to add a new user
router.post('/users', residentController.addResident);

module.exports = router;

