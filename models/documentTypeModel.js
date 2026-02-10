const db = require('../config/db');

const DocumentType = {
    // Get all active document types
    findAll: async () => {
        const [rows] = await db.execute(`
            SELECT * FROM document_types 
            WHERE is_active = TRUE 
            ORDER BY type, name
        `);
        return rows;
    },

    // Get document types by type (barangay or municipal)
    findByType: async (type) => {
        const [rows] = await db.execute(`
            SELECT * FROM document_types 
            WHERE type = ? AND is_active = TRUE 
            ORDER BY name
        `, [type]);
        return rows;
    },

    // Get barangay document types only
    findBarangayTypes: async () => {
        const [rows] = await db.execute(`
            SELECT * FROM document_types 
            WHERE type = 'barangay' AND is_active = TRUE 
            ORDER BY name
        `);
        return rows;
    },

    // Get municipal document types only
    findMunicipalTypes: async () => {
        const [rows] = await db.execute(`
            SELECT * FROM document_types 
            WHERE type = 'municipal' AND is_active = TRUE 
            ORDER BY name
        `);
        return rows;
    },

    // Get a specific document type by ID
    findById: async (id) => {
        const [rows] = await db.execute(`
            SELECT * FROM document_types WHERE id = ?
        `, [id]);
        return rows[0];
    },

    // Get a specific document type by name and type
    findByNameAndType: async (name, type) => {
        const [rows] = await db.execute(`
            SELECT * FROM document_types 
            WHERE name = ? AND type = ? AND is_active = TRUE
        `, [name, type]);
        return rows[0];
    },

    // Create a new document type (for admin use)
    create: async (documentTypeData) => {
        const { name, type, description, requirements, fee, processing_days } = documentTypeData;
        const [result] = await db.execute(`
            INSERT INTO document_types (name, type, description, requirements, fee, processing_days) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, [name, type, description, requirements, fee, processing_days]);
        return result;
    },

    // Update a document type
    update: async (id, documentTypeData) => {
        const { name, type, description, requirements, fee, processing_days, is_active } = documentTypeData;
        const [result] = await db.execute(`
            UPDATE document_types 
            SET name = ?, type = ?, description = ?, requirements = ?, fee = ?, processing_days = ?, is_active = ?, updated_at = NOW()
            WHERE id = ?
        `, [name, type, description, requirements, fee, processing_days, is_active, id]);
        return result;
    },

    // Soft delete (deactivate) a document type
    deactivate: async (id) => {
        const [result] = await db.execute(`
            UPDATE document_types 
            SET is_active = FALSE, updated_at = NOW() 
            WHERE id = ?
        `, [id]);
        return result;
    },

    // Reactivate a document type
    activate: async (id) => {
        const [result] = await db.execute(`
            UPDATE document_types 
            SET is_active = TRUE, updated_at = NOW() 
            WHERE id = ?
        `, [id]);
        return result;
    },

    // Get document types with their usage statistics
    findWithStats: async () => {
        const [rows] = await db.execute(`
            SELECT dt.*, 
                   COUNT(dr.id) as total_requests,
                   COUNT(CASE WHEN dr.status = 'completed' THEN 1 END) as completed_requests,
                   AVG(CASE WHEN dr.status = 'completed' THEN dr.fee_amount END) as avg_fee
            FROM document_types dt
            LEFT JOIN document_requests dr ON dt.name = dr.document_type AND dt.type = dr.request_type
            WHERE dt.is_active = TRUE
            GROUP BY dt.id
            ORDER BY dt.type, dt.name
        `);
        return rows;
    }
};

module.exports = DocumentType;