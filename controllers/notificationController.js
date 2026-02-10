const Notification = require('../models/notificationModel');

const notificationController = {
    // Get all notifications for the logged-in user
    getUserNotifications: async (req, res) => {
        const { userId } = req.params; // or get from JWT token
        
        try {
            const notifications = await Notification.findByUserId(userId);
            res.status(200).json({
                success: true,
                data: notifications
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve notifications',
                error: error.message
            });
        }
    },

    // Get unread notifications for the logged-in user
    getUnreadNotifications: async (req, res) => {
        const { userId } = req.params;
        
        try {
            const notifications = await Notification.findUnreadByUserId(userId);
            res.status(200).json({
                success: true,
                data: notifications
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve unread notifications',
                error: error.message
            });
        }
    },

    // Get notification counts
    getNotificationCounts: async (req, res) => {
        const { userId } = req.params;
        
        try {
            const counts = await Notification.getCountByUserId(userId);
            res.status(200).json({
                success: true,
                data: counts
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve notification counts',
                error: error.message
            });
        }
    },

    // Mark a notification as read
    markAsRead: async (req, res) => {
        const { id } = req.params;
        
        try {
            const notification = await Notification.findById(id);
            if (!notification) {
                return res.status(404).json({
                    success: false,
                    message: 'Notification not found'
                });
            }

            await Notification.markAsRead(id);
            res.status(200).json({
                success: true,
                message: 'Notification marked as read'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to mark notification as read',
                error: error.message
            });
        }
    },

    // Mark all notifications as read for a user
    markAllAsRead: async (req, res) => {
        const { userId } = req.params;
        
        try {
            await Notification.markAllAsReadByUserId(userId);
            res.status(200).json({
                success: true,
                message: 'All notifications marked as read'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to mark all notifications as read',
                error: error.message
            });
        }
    },

    // Create a new notification (admin/system use)
    createNotification: async (req, res) => {
        const { userId, title, message, type, relatedRequestId } = req.body;
        
        try {
            if (!userId || !title || !message) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID, title, and message are required'
                });
            }

            const result = await Notification.create({
                userId,
                title,
                message,
                type: type || 'info',
                relatedRequestId
            });

            res.status(201).json({
                success: true,
                message: 'Notification created successfully',
                data: { id: result.insertId }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to create notification',
                error: error.message
            });
        }
    },

    // Delete a notification
    deleteNotification: async (req, res) => {
        const { id } = req.params;
        
        try {
            const notification = await Notification.findById(id);
            if (!notification) {
                return res.status(404).json({
                    success: false,
                    message: 'Notification not found'
                });
            }

            await Notification.delete(id);
            res.status(200).json({
                success: true,
                message: 'Notification deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete notification',
                error: error.message
            });
        }
    },

    // Delete all notifications for a user
    deleteAllNotifications: async (req, res) => {
        const { userId } = req.params;
        
        try {
            await Notification.deleteAllByUserId(userId);
            res.status(200).json({
                success: true,
                message: 'All notifications deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete all notifications',
                error: error.message
            });
        }
    }
};

module.exports = notificationController;