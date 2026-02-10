const DocumentRequest = require('../models/documentRequest');
const Notification = require('../models/notificationModel');

const documentRequestController = {
    // Create a new document request
    createDocumentRequest: async (req, res) => {
        const { residentId, documentType, requestType, barangayId, purpose } = req.body;
        
        try {
            // Validate required fields
            if (!residentId || !documentType || !requestType) {
                return res.status(400).json({
                    success: false,
                    message: 'Resident ID, document type, and request type are required'
                });
            }

            // Validate request type
            if (requestType !== 'barangay' && requestType !== 'municipal') {
                return res.status(400).json({
                    success: false,
                    message: 'Request type must be either "barangay" or "municipal"'
                });
            }

            // If barangay request, barangay ID is required
            if (requestType === 'barangay' && !barangayId) {
                return res.status(400).json({
                    success: false,
                    message: 'Barangay ID is required for barangay requests'
                });
            }

            const result = await DocumentRequest.create({
                residentId,
                documentType,
                requestType,
                barangayId: requestType === 'barangay' ? barangayId : null,
                purpose
            });

            // Create notification for the resident
            await Notification.create({
                userId: residentId, // This should be user_id, you might need to get it from residents table
                title: 'Document Request Submitted',
                message: `Your ${documentType} request has been submitted successfully.`,
                type: 'info',
                relatedRequestId: result.insertId
            });

            res.status(201).json({
                success: true,
                message: 'Document request created successfully',
                data: { id: result.insertId }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to create document request',
                error: error.message
            });
        }
    },

    // Get all document requests (admin view)
    getAllDocumentRequests: async (req, res) => {
        try {
            const requests = await DocumentRequest.findAllDocumentRequests();
            res.status(200).json({
                success: true,
                data: requests
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve document requests',
                error: error.message
            });
        }
    },

    // Get document requests by resident
    getDocumentRequestsByResident: async (req, res) => {
        const { residentId } = req.params;
        
        try {
            const requests = await DocumentRequest.findByResident(residentId);
            res.status(200).json({
                success: true,
                data: requests
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve resident document requests',
                error: error.message
            });
        }
    },

    // Get document requests by status
    getDocumentRequestsByStatus: async (req, res) => {
        const { status } = req.params;
        
        try {
            const requests = await DocumentRequest.findByStatus(status);
            res.status(200).json({
                success: true,
                data: requests,
                status: status
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Failed to retrieve ${status} document requests`,
                error: error.message
            });
        }
    },

    // Get barangay document requests
    getBarangayDocumentRequests: async (req, res) => {
        const { barangayId } = req.params;
        
        try {
            const requests = await DocumentRequest.findBarangayRequests(barangayId);
            res.status(200).json({
                success: true,
                data: requests,
                type: 'barangay'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve barangay document requests',
                error: error.message
            });
        }
    },

    // Get municipal document requests
    getMunicipalDocumentRequests: async (req, res) => {
        try {
            const requests = await DocumentRequest.findMunicipalRequests();
            res.status(200).json({
                success: true,
                data: requests,
                type: 'municipal'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve municipal document requests',
                error: error.message
            });
        }
    },

    // Get a specific document request by ID
    getDocumentRequestById: async (req, res) => {
        const { id } = req.params;
        
        try {
            const request = await DocumentRequest.findById(id);
            if (!request) {
                return res.status(404).json({
                    success: false,
                    message: 'Document request not found'
                });
            }

            res.status(200).json({
                success: true,
                data: request
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve document request',
                error: error.message
            });
        }
    },

    // Update document request status
    updateDocumentRequestStatus: async (req, res) => {
        const { id } = req.params;
        const { status, notes, processedBy, documentNumber, feeAmount } = req.body;
        
        try {
            const existingRequest = await DocumentRequest.findById(id);
            if (!existingRequest) {
                return res.status(404).json({
                    success: false,
                    message: 'Document request not found'
                });
            }

            // Update the request
            await DocumentRequest.updateStatus(id, status);
            
            // If additional fields provided, update them too
            if (notes || processedBy || documentNumber || feeAmount) {
                await DocumentRequest.updateDocumentRequest(id, {
                    documentType: existingRequest.document_type,
                    requestType: existingRequest.request_type,
                    barangayId: existingRequest.barangay_id,
                    status,
                    notes: notes || existingRequest.notes,
                    processedBy: processedBy || existingRequest.processed_by,
                    documentNumber: documentNumber || existingRequest.document_number,
                    feeAmount: feeAmount || existingRequest.fee_amount
                });
            }

            // Create notification for status change
            await Notification.createForDocumentRequest(id, status);

            res.status(200).json({
                success: true,
                message: 'Document request status updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update document request status',
                error: error.message
            });
        }
    },

    // Delete a document request
    deleteDocumentRequest: async (req, res) => {
        const { id } = req.params;
        
        try {
            const existingRequest = await DocumentRequest.findById(id);
            if (!existingRequest) {
                return res.status(404).json({
                    success: false,
                    message: 'Document request not found'
                });
            }

            await DocumentRequest.deleteDocumentRequest(id);
            res.status(200).json({
                success: true,
                message: 'Document request deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete document request',
                error: error.message
            });
        }
    }
};

module.exports = documentRequestController;