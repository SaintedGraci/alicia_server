import express from 'express';
import adminController from '../controllers/adminControllers.js';
const router = express.Router();

// Route to get all users
router.get('/users', adminController.getAllUsers);

// Route to delete a user by ID
router.delete('/users/:id', adminController.deleteUser);

// Route to add a new user
router.post('/users', adminController.addUser);




module.exports = router;