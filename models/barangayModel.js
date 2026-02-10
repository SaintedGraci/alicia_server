const db = require('../config/db');

const Barangay = {
    create: async (barangayData) => {
        const { name, municipalityId, contactEmail, contactPhone } = barangayData;
        const [result] = await db.execute(
            'INSERT INTO barangays (name, municipality_id, contact_email, contact_phone) VALUES (?, ?, ?, ?)',
            [name, municipalityId, contactEmail, contactPhone]
        );
        return result;
    },

    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM barangays WHERE id = ?', [id]);
        return rows[0];
    },

    findByName: async (name) => {
        const [rows] = await db.execute('SELECT * FROM barangays WHERE name = ?', [name]);
        return rows[0];
    },

    findByMunicipality: async (municipalityId) => {
        const [rows] = await db.execute('SELECT * FROM barangays WHERE municipality_id = ?', [municipalityId]);
        return rows;
    },

    updateBarangay: async (id, barangayData) => {
        const { name, municipalityId, contactEmail, contactPhone } = barangayData;
        const [result] = await db.execute(
            'UPDATE barangays SET name = ?, municipality_id = ?, contact_email = ?, contact_phone = ? WHERE id = ?',
            [name, municipalityId, contactEmail, contactPhone, id]
        );
        return result;
    },

    deleteBarangay: async (id) => {
        const [result] = await db.execute('DELETE FROM barangays WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Barangay;