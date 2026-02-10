const express = require('express');
const router = express.Router();
const documentRequestController = require('../controllers/documentRequestController');

// Create a new document request
router.post('/', documentRequestController.createDocumentRequest);

// Get all document requests (admin view)
router.get('/', documentRequestController.getAllDocumentRequests);

// Get document requests by resident
router.get('/resident/:residentId', documentRequestController.getDocumentRequestsByResident);

// Get document requests by status
router.get('/status/:status', documentRequestController.getDocumentRequestsByStatus);

// Get barangay document requests
router.get('/barangay/:barangayId', documentRequestController.getBarangayDocumentRequests);

// Get municipal document requests
router.get('/municipal', documentRequestController.getMunicipalDocumentRequests);

// Get a specific document request by ID
router.get('/:id', documentRequestController.getDocumentRequestById);

// Update document request status
router.put('/:id/status', documentRequestController.updateDocumentRequestStatus);

// Delete a document request
router.delete('/:id', documentRequestController.deleteDocumentRequest);

module.exports = router;