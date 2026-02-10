const db = require('../config/db');

const Notification = {
    // Create a new notification
    create: async (notificationData) => {
        const { userId, title, message, type = 'info', relatedRequestId = null } = notificationData;
        const [result] = await db.execute(`
            INSERT INTO notifications (user_id, title, message, type, related_request_id) 
            VALUES (?, ?, ?, ?, ?)
        `, [userId, title, message, type, relatedRequestId]);
        return result;
    },

    // Get all notifications for a user
    findByUserId: async (userId) => {
        const [rows] = await db.execute(`
            SELECT n.*, 
                   dr.document_type, dr.status as request_status
            FROM notifications n
            LEFT JOIN document_requests dr ON n.related_request_id = dr.id
            WHERE n.user_id = ?
            ORDER BY n.created_at DESC
        `, [userId]);
        return rows;
    },

    // Get unread notifications for a user
    findUnreadByUserId: async (userId) => {
        const [rows] = await db.execute(`
            SELECT n.*, 
                   dr.document_type, dr.status as request_status
            FROM notifications n
            LEFT JOIN document_requests dr ON n.related_request_id = dr.id
            WHERE n.user_id = ? AND n.is_read = FALSE
            ORDER BY n.created_at DESC
        `, [userId]);
        return rows;
    },

    // Get notification by ID
    findById: async (id) => {
        const [rows] = await db.execute(`
            SELECT n.*, 
                   dr.document_type, dr.status as request_status
            FROM notifications n
            LEFT JOIN document_requests dr ON n.related_request_id = dr.id
            WHERE n.id = ?
        `, [id]);
        return rows[0];
    },

    // Mark notification as read
    markAsRead: async (id) => {
        const [result] = await db.execute(`
            UPDATE notifications 
            SET is_read = TRUE 
            WHERE id = ?
        `, [id]);
        return result;
    },

    // Mark all notifications as read for a user
    markAllAsReadByUserId: async (userId) => {
        const [result] = await db.execute(`
            UPDATE notifications 
            SET is_read = TRUE 
            WHERE user_id = ? AND is_read = FALSE
        `, [userId]);
        return result;
    },

    // Delete a notification
    delete: async (id) => {
        const [result] = await db.execute(`
            DELETE FROM notifications WHERE id = ?
        `, [id]);
        return result;
    },

    // Delete all notifications for a user
    deleteAllByUserId: async (userId) => {
        const [result] = await db.execute(`
            DELETE FROM notifications WHERE user_id = ?
        `, [userId]);
        return result;
    },

    // Get notification count for a user
    getCountByUserId: async (userId) => {
        const [rows] = await db.execute(`
            SELECT 
                COUNT(*) as total_notifications,
                COUNT(CASE WHEN is_read = FALSE THEN 1 END) as unread_notifications
            FROM notifications 
            WHERE user_id = ?
        `, [userId]);
        return rows[0];
    },

    // Create notification for document request update
    createForDocumentRequest: async (requestId, status) => {
        // First get the request details
        const [requestRows] = await db.execute(`
            SELECT dr.*, r.user_id, u.username
            FROM document_requests dr
            JOIN residents r ON dr.resident_id = r.id
            JOIN users u ON r.user_id = u.id
            WHERE dr.id = ?
        `, [requestId]);

        if (requestRows.length === 0) return null;

        const request = requestRows[0];
        
        // Create appropriate notification message
        let title, message, type;
        
        switch (status) {
            case 'processing':
                title = 'Document Request Being Processed';
                message = `Your ${request.document_type} request is now being processed.`;
                type = 'info';
                break;
            case 'approved':
                title = 'Document Request Approved';
                message = `Your ${request.document_type} request has been approved and is being prepared.`;
                type = 'success';
                break;
            case 'ready':
                title = 'Document Ready for Pickup';
                message = `Your ${request.document_type} is ready for pickup. Please visit the office.`;
                type = 'success';
                break;
            case 'completed':
                title = 'Document Request Completed';
                message = `Your ${request.document_type} request has been completed successfully.`;
                type = 'success';
                break;
            case 'rejected':
                title = 'Document Request Rejected';
                message = `Your ${request.document_type} request has been rejected. Please check the notes for details.`;
                type = 'error';
                break;
            default:
                title = 'Document Request Updated';
                message = `Your ${request.document_type} request status has been updated.`;
                type = 'info';
        }

        const [result] = await db.execute(`
            INSERT INTO notifications (user_id, title, message, type, related_request_id) 
            VALUES (?, ?, ?, ?, ?)
        `, [request.user_id, title, message, type, requestId]);
        
        return result;
    }
};

module.exports = Notification;