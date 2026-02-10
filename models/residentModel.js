const db = require('../config/db');

const Resident = {
    create: async (residentData) => {
        const { userId, barangayId, firstName, lastName, middleName, address, phone } = residentData;
        const [result] = await db.execute(
            'INSERT INTO residents (user_id, barangay_id, first_name, last_name, middle_name, address, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, barangayId, firstName, lastName, middleName, address, phone]
        );
        return result;
    },

    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM residents WHERE id = ?', [id]);
        return rows[0];
    },

    updateResident: async (id, residentData) => {
        const { userId, barangayId, firstName, lastName, middleName, address, phone } = residentData;
        const [result] = await db.execute(
            'UPDATE residents SET user_id = ?, barangay_id = ?, first_name = ?, last_name = ?, middle_name = ?, address = ?, phone = ? WHERE id = ?',
            [userId, barangayId, firstName, lastName, middleName, address, phone, id]
        );
        return result;
    },

    deleteResident: async (id) => {
        const [result] = await db.execute('DELETE FROM residents WHERE id = ?', [id]);
        return result;
    },

    findAllResident: async () => {
        const [rows] = await db.execute('SELECT * FROM residents');
        return rows;
    },

    findByBarangay: async (barangayId) => {
        const [rows] = await db.execute('SELECT * FROM residents WHERE barangay_id = ?', [barangayId]);
        return rows;
    },

    findByUser: async (userId) => {
        const [rows] = await db.execute('SELECT * FROM residents WHERE user_id = ?', [userId]);
        return rows[0];
    }
};

module.exports = Resident;