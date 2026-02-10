const express = require('express');
const router = express.Router();
const documentTypeController = require('../controllers/documentTypeController');

// Public routes (for residents to see available documents)
router.get('/', documentTypeController.getAllDocumentTypes);
router.get('/type/:type', documentTypeController.getDocumentTypesByType); // /type/barangay or /type/municipal
router.get('/barangay', documentTypeController.getBarangayDocumentTypes);
router.get('/municipal', documentTypeController.getMunicipalDocumentTypes);
router.get('/:id', documentTypeController.getDocumentTypeById);

// Admin routes (for managing document types)
router.post('/', documentTypeController.createDocumentType);
router.put('/:id', documentTypeController.updateDocumentType);
router.delete('/:id', documentTypeController.deactivateDocumentType);

// Statistics route (for admin dashboard)
router.get('/stats/all', documentTypeController.getDocumentTypesWithStats);

module.exports = router;