const express = require('express');
const router = express.Router();
const barangayController = require('../controllers/barangayController');

// Get all barangays
router.get('/', barangayController.getAllBarangays);

// Get barangay by ID
router.get('/:id', barangayController.getBarangayById);

// Get barangay by name
router.get('/name/:name', barangayController.getBarangayByName);

// Get barangays by municipality
router.get('/municipality/:municipalityId', barangayController.getBarangayByMunicipality);

// Add new barangay
router.post('/', barangayController.addBarangay);

// Update barangay
router.put('/:id', barangayController.updateBarangay);

// Delete barangay
router.delete('/:id', barangayController.deleteBarangay);

module.exports = router;