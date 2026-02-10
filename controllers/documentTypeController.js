const DocumentType = require('../models/documentTypeModel');

const documentTypeController = {
    // Get all document types
    getAllDocumentTypes: async (req, res) => {
        try {
            const documentTypes = await DocumentType.findAll();
            res.status(200).json({ 
                success: true,
                data: documentTypes 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: 'Failed to retrieve document types', 
                error: error.message 
            });
        }
    },

    // Get document types by type (barangay or municipal)
    getDocumentTypesByType: async (req, res) => {
        const { type } = req.params; // 'barangay' or 'municipal'
        
        try {
            if (type !== 'barangay' && type !== 'municipal') {
                return res.status(400).json({
                    success: false,
                    message: 'Type must be either "barangay" or "municipal"'
                });
            }

            const documentTypes = await DocumentType.findByType(type);
            res.status(200).json({ 
                success: true,
                data: documentTypes,
                type: type
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: `Failed to retrieve ${type} document types`, 
                error: error.message 
            });
        }
    },

    // Get barangay document types
    getBarangayDocumentTypes: async (req, res) => {
        try {
            const documentTypes = await DocumentType.findBarangayTypes();
            res.status(200).json({ 
                success: true,
                data: documentTypes,
                type: 'barangay'
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: 'Failed to retrieve barangay document types', 
                error: error.message 
            });
        }
    },

    // Get municipal document types
    getMunicipalDocumentTypes: async (req, res) => {
        try {
            const documentTypes = await DocumentType.findMunicipalTypes();
            res.status(200).json({ 
                success: true,
                data: documentTypes,
                type: 'municipal'
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: 'Failed to retrieve municipal document types', 
                error: error.message 
            });
        }
    },

    // Get a specific document type by ID
    getDocumentTypeById: async (req, res) => {
        const { id } = req.params;
        
        try {
            const documentType = await DocumentType.findById(id);
            if (!documentType) {
                return res.status(404).json({
                    success: false,
                    message: 'Document type not found'
                });
            }

            res.status(200).json({ 
                success: true,
                data: documentType 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: 'Failed to retrieve document type', 
                error: error.message 
            });
        }
    },

    // Create a new document type (admin only)
    createDocumentType: async (req, res) => {
        const { name, type, description, requirements, fee, processing_days } = req.body;
        
        try {
            // Validate required fields
            if (!name || !type) {
                return res.status(400).json({
                    success: false,
                    message: 'Name and type are required'
                });
            }

            if (type !== 'barangay' && type !== 'municipal') {
                return res.status(400).json({
                    success: false,
                    message: 'Type must be either "barangay" or "municipal"'
                });
            }

            // Check if document type already exists
            const existing = await DocumentType.findByNameAndType(name, type);
            if (existing) {
                return res.status(409).json({
                    success: false,
                    message: 'Document type already exists'
                });
            }

            const result = await DocumentType.create({
                name,
                type,
                description,
                requirements,
                fee: fee || 0.00,
                processing_days: processing_days || 1
            });

            res.status(201).json({ 
                success: true,
                message: 'Document type created successfully', 
                data: { id: result.insertId }
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: 'Failed to create document type', 
                error: error.message 
            });
        }
    },

    // Update a document type
    updateDocumentType: async (req, res) => {
        const { id } = req.params;
        const { name, type, description, requirements, fee, processing_days, is_active } = req.body;
        
        try {
            // Check if document type exists
            const existing = await DocumentType.findById(id);
            if (!existing) {
                return res.status(404).json({
                    success: false,
                    message: 'Document type not found'
                });
            }

            const result = await DocumentType.update(id, {
                name: name || existing.name,
                type: type || existing.type,
                description: description || existing.description,
                requirements: requirements || existing.requirements,
                fee: fee !== undefined ? fee : existing.fee,
                processing_days: processing_days || existing.processing_days,
                is_active: is_active !== undefined ? is_active : existing.is_active
            });

            res.status(200).json({ 
                success: true,
                message: 'Document type updated successfully'
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: 'Failed to update document type', 
                error: error.message 
            });
        }
    },

    // Deactivate a document type
    deactivateDocumentType: async (req, res) => {
        const { id } = req.params;
        
        try {
            const existing = await DocumentType.findById(id);
            if (!existing) {
                return res.status(404).json({
                    success: false,
                    message: 'Document type not found'
                });
            }

            await DocumentType.deactivate(id);
            res.status(200).json({ 
                success: true,
                message: 'Document type deactivated successfully'
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: 'Failed to deactivate document type', 
                error: error.message 
            });
        }
    },

    // Get document types with statistics
    getDocumentTypesWithStats: async (req, res) => {
        try {
            const documentTypes = await DocumentType.findWithStats();
            res.status(200).json({ 
                success: true,
                data: documentTypes 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: 'Failed to retrieve document types with statistics', 
                error: error.message 
            });
        }
    }
};

module.exports = documentTypeController;