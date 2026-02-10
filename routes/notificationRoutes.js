const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Get all notifications for a user
router.get('/user/:userId', notificationController.getUserNotifications);

// Get unread notifications for a user
router.get('/user/:userId/unread', notificationController.getUnreadNotifications);

// Get notification counts for a user
router.get('/user/:userId/counts', notificationController.getNotificationCounts);

// Mark a notification as read
router.put('/:id/read', notificationController.markAsRead);

// Mark all notifications as read for a user
router.put('/user/:userId/read-all', notificationController.markAllAsRead);

// Create a new notification (admin/system use)
router.post('/', notificationController.createNotification);

// Delete a notification
router.delete('/:id', notificationController.deleteNotification);

// Delete all notifications for a user
router.delete('/user/:userId/all', notificationController.deleteAllNotifications);

module.exports = router;