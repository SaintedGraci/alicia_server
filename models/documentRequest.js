const db = require('../config/db');

const DocumentRequest = {
    create: async (documentRequestData) => {
        const { residentId, documentType, requestType, barangayId, status = 'pending' } = documentRequestData;
        
        // requestType can be 'barangay' or 'municipal'
        // If it's barangay request, we need barangayId
        // If it's municipal request, barangayId can be null
        
        const [result] = await db.execute(
            'INSERT INTO document_requests (resident_id, document_type, request_type, barangay_id, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
            [residentId, documentType, requestType, barangayId, status]
        );
        return result;
    },

    findById: async (id) => {
        const [rows] = await db.execute(`
            SELECT dr.*, 
                   r.first_name, r.last_name, r.address,
                   b.name as barangay_name
            FROM document_requests dr
            LEFT JOIN residents r ON dr.resident_id = r.id
            LEFT JOIN barangays b ON dr.barangay_id = b.id
            WHERE dr.id = ?
        `, [id]);
        return rows[0];
    },

    updateDocumentRequest: async (id, documentRequestData) => {
        const { documentType, requestType, barangayId, status } = documentRequestData;
        const [result] = await db.execute(
            'UPDATE document_requests SET document_type = ?, request_type = ?, barangay_id = ?, status = ?, updated_at = NOW() WHERE id = ?',
            [documentType, requestType, barangayId, status, id]
        );
        return result;
    }, 

    updateStatus: async (id, status) => {
        const [result] = await db.execute(
            'UPDATE document_requests SET status = ?, updated_at = NOW() WHERE id = ?',
            [status, id]
        );
        return result;
    },

    deleteDocumentRequest: async (id) => {
        const [result] = await db.execute('DELETE FROM document_requests WHERE id = ?', [id]);
        return result;
    },

    // Get all document requests
    findAllDocumentRequests: async () => {
        const [rows] = await db.execute(`
            SELECT dr.*, 
                   r.first_name, r.last_name, r.address,
                   b.name as barangay_name
            FROM document_requests dr
            LEFT JOIN residents r ON dr.resident_id = r.id
            LEFT JOIN barangays b ON dr.barangay_id = b.id
            ORDER BY dr.created_at DESC
        `);
        return rows;
    },

    // Get requests by status (pending, approved, ready, completed)
    findByStatus: async (status) => {
        const [rows] = await db.execute(`
            SELECT dr.*, 
                   r.first_name, r.last_name, r.address,
                   b.name as barangay_name
            FROM document_requests dr
            LEFT JOIN residents r ON dr.resident_id = r.id
            LEFT JOIN barangays b ON dr.barangay_id = b.id
            WHERE dr.status = ?
            ORDER BY dr.created_at DESC
        `, [status]);
        return rows;
    },

    // Get BARANGAY requests for a specific barangay
    findBarangayRequests: async (barangayId) => {
        const [rows] = await db.execute(`
            SELECT dr.*, 
                   r.first_name, r.last_name, r.address,
                   b.name as barangay_name
            FROM document_requests dr
            LEFT JOIN residents r ON dr.resident_id = r.id
            LEFT JOIN barangays b ON dr.barangay_id = b.id
            WHERE dr.request_type = 'barangay' AND dr.barangay_id = ?
            ORDER BY dr.created_at DESC
        `, [barangayId]);
        return rows;
    },
    
    // Get MUNICIPAL requests (for Alicia Municipality)
    findMunicipalRequests: async () => {
        const [rows] = await db.execute(`
            SELECT dr.*, 
                   r.first_name, r.last_name, r.address,
                   b.name as barangay_name
            FROM document_requests dr
            LEFT JOIN residents r ON dr.resident_id = r.id
            LEFT JOIN barangays b ON dr.barangay_id = b.id
            WHERE dr.request_type = 'municipal'
            ORDER BY dr.created_at DESC
        `);
        return rows;
    },

    // Get requests by a specific resident
    findByResident: async (residentId) => {
        const [rows] = await db.execute(`
            SELECT dr.*, 
                   b.name as barangay_name
            FROM document_requests dr
            LEFT JOIN barangays b ON dr.barangay_id = b.id
            WHERE dr.resident_id = ?
            ORDER BY dr.created_at DESC
        `, [residentId]);
        return rows;
    },

    // Get requests by type (barangay or municipal)
    findByRequestType: async (requestType) => {
        const [rows] = await db.execute(`
            SELECT dr.*, 
                   r.first_name, r.last_name, r.address,
                   b.name as barangay_name
            FROM document_requests dr
            LEFT JOIN residents r ON dr.resident_id = r.id
            LEFT JOIN barangays b ON dr.barangay_id = b.id
            WHERE dr.request_type = ?
            ORDER BY dr.created_at DESC
        `, [requestType]);
        return rows;
    }
};

module.exports = DocumentRequest;