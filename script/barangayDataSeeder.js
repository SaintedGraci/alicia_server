const db = require('../config/db');

const barangays = [
    { name: 'Poblacion', contact_email: 'poblacion@alicia.gov.ph', contact_phone: '09171234567' },
    { name: 'Tabaoan', contact_email: 'tabaoan@alicia.gov.ph', contact_phone: '09171234568' },
    { name: 'San Isidro', contact_email: 'sanisidro@alicia.gov.ph', contact_phone: '09171234569' },
    { name: 'Santa Cruz', contact_email: 'santacruz@alicia.gov.ph', contact_phone: '09171234570' },
    { name: 'Cayupo', contact_email: 'cayupo@alicia.gov.ph', contact_phone: '09171234571' },
    { name: 'Cabatang', contact_email: 'cabatang@alicia.gov.ph', contact_phone: '09171234572' },
    { name: 'Napo', contact_email: 'napo@alicia.gov.ph', contact_phone: '09171234573' },
    { name: 'Pagahat', contact_email: 'pagahat@alicia.gov.ph', contact_phone: '09171234574' },
];

const seedBarangayData = async () => {
    try {
        console.log('Starting barangay data seeding...');
        
        // Get or create municipality
        let [municipalities] = await db.execute('SELECT id FROM municipalities WHERE name = ?', ['Alicia']);
        let municipalityId;
        
        if (municipalities.length === 0) {
            console.log('Creating Alicia municipality...');
            const [result] = await db.execute(
                'INSERT INTO municipalities (name, code) VALUES (?, ?)',
                ['Alicia', 'ALICIA']
            );
            municipalityId = result.insertId;
            console.log('✓ Municipality created');
        } else {
            municipalityId = municipalities[0].id;
            console.log('✓ Municipality already exists');
        }
        
        // Seed barangays
        for (const barangay of barangays) {
            const [existing] = await db.execute(
                'SELECT id FROM barangays WHERE name = ? AND municipality_id = ?',
                [barangay.name, municipalityId]
            );
            
            if (existing.length > 0) {
                console.log(`✓ Barangay "${barangay.name}" already exists`);
                continue;
            }
            
            await db.execute(
                'INSERT INTO barangays (name, municipality_id, contact_email, contact_phone) VALUES (?, ?, ?, ?)',
                [barangay.name, municipalityId, barangay.contact_email, barangay.contact_phone]
            );
            console.log(`✓ Created barangay: ${barangay.name}`);
        }
        
        console.log('\n✅ Barangay data seeding completed!');
        console.log(`Total barangays: ${barangays.length}`);
        
    } catch (error) {
        console.error('❌ Error seeding barangay data:', error);
    } finally {
        process.exit();
    }
};

seedBarangayData();
