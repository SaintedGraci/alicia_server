const db = require('../config/db');

const Municipality = {
    // Since you only have Alicia Municipality, we can simplify this
    
    // Get Alicia Municipality info
    getAliciaMunicipality: async () => {
        const [rows] = await db.execute("SELECT * FROM municipalities WHERE name = 'Alicia' LIMIT 1");
        return rows[0];
    },

    // Create Alicia Municipality (run this once during setup)
    createAliciaMunicipality: async () => {
        const [result] = await db.execute(
            "INSERT INTO municipalities (name, code) VALUES ('Alicia', 'ALICIA') ON DUPLICATE KEY UPDATE name = name",
        );
        return result;
    },

    // Update Alicia Municipality info
    updateAliciaMunicipality: async (municipalityData) => {
        const { name = 'Alicia', code = 'ALICIA' } = municipalityData;
        const [result] = await db.execute(
            'UPDATE municipalities SET name = ?, code = ? WHERE name = "Alicia"',
            [name, code]
        );
        return result;
    },

    // Get all barangays under Alicia Municipality
    getAllBarangays: async () => {
        const [rows] = await db.execute(`
            SELECT b.* FROM barangays b
            JOIN municipalities m ON b.municipality_id = m.id
            WHERE m.name = 'Alicia'
            ORDER BY b.name
        `);
        return rows;
    }
};  

module.exports = Municipality;