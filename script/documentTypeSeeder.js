const db = require('../config/db');

const documentTypes = [
    // Barangay Documents
    {
        name: 'Barangay Clearance',
        type: 'barangay',
        description: 'Certificate issued by the barangay certifying that the resident has no derogatory records',
        requirements: 'Valid ID, Proof of Residency, Cedula',
        fee: 50.00,
        processing_days: 1
    },
    {
        name: 'Certificate of Residency',
        type: 'barangay',
        description: 'Certificate proving that the person is a resident of the barangay',
        requirements: 'Valid ID, Proof of Address',
        fee: 30.00,
        processing_days: 1
    },
    {
        name: 'Barangay ID',
        type: 'barangay',
        description: 'Official identification card issued by the barangay',
        requirements: 'Valid ID, 1x1 Photo, Proof of Residency',
        fee: 100.00,
        processing_days: 3
    },
    {
        name: 'Certificate of Indigency',
        type: 'barangay',
        description: 'Certificate for low-income residents to avail of government assistance',
        requirements: 'Valid ID, Proof of Income or Unemployment',
        fee: 0.00,
        processing_days: 1
    },
    {
        name: 'Barangay Business Clearance',
        type: 'barangay',
        description: 'Clearance required for businesses operating within the barangay',
        requirements: 'Business Registration, Valid ID, Barangay Clearance',
        fee: 200.00,
        processing_days: 2
    },
    {
        name: 'Certificate of Good Moral Character',
        type: 'barangay',
        description: 'Certificate attesting to the good moral standing of the resident',
        requirements: 'Valid ID, Barangay Clearance',
        fee: 50.00,
        processing_days: 1
    },

    // Municipal Documents
    {
        name: 'Business Permit',
        type: 'municipal',
        description: 'Official permit to operate a business within the municipality',
        requirements: 'DTI/SEC Registration, Barangay Business Clearance, Fire Safety Certificate, Sanitary Permit',
        fee: 500.00,
        processing_days: 5
    },
    {
        name: 'Municipal Clearance',
        type: 'municipal',
        description: 'Clearance issued by the municipality for various purposes',
        requirements: 'Valid ID, Barangay Clearance, Cedula',
        fee: 100.00,
        processing_days: 3
    },
    {
        name: 'Building Permit',
        type: 'municipal',
        description: 'Permit required for construction or renovation of buildings',
        requirements: 'Building Plans, Land Title, Tax Declaration, Barangay Clearance',
        fee: 1000.00,
        processing_days: 10
    },
    {
        name: "Mayor's Permit",
        type: 'municipal',
        description: 'Special permit issued by the mayor for specific activities or events',
        requirements: 'Letter of Request, Valid ID, Barangay Clearance',
        fee: 200.00,
        processing_days: 3
    },
    {
        name: 'Occupancy Permit',
        type: 'municipal',
        description: 'Permit certifying that a building is safe for occupancy',
        requirements: 'Building Permit, Certificate of Completion, Fire Safety Certificate',
        fee: 300.00,
        processing_days: 5
    },
    {
        name: 'Fencing Permit',
        type: 'municipal',
        description: 'Permit required for construction of fences',
        requirements: 'Fencing Plans, Land Title, Barangay Clearance',
        fee: 150.00,
        processing_days: 3
    },
    {
        name: 'Demolition Permit',
        type: 'municipal',
        description: 'Permit required for demolition of structures',
        requirements: 'Demolition Plans, Land Title, Barangay Clearance',
        fee: 250.00,
        processing_days: 5
    },
    {
        name: 'Certificate of No Pending Case',
        type: 'municipal',
        description: 'Certificate stating that the person has no pending legal cases in the municipality',
        requirements: 'Valid ID, Municipal Clearance',
        fee: 100.00,
        processing_days: 3
    }
];

const seedDocumentTypes = async () => {
    try {
        console.log('Starting document types seeding...');

        for (const docType of documentTypes) {
            // Check if document type already exists
            const [existing] = await db.execute(
                'SELECT id FROM document_types WHERE name = ? AND type = ?',
                [docType.name, docType.type]
            );

            if (existing.length > 0) {
                console.log(`✓ Document type "${docType.name}" (${docType.type}) already exists`);
                continue;
            }

            // Insert new document type
            await db.execute(
                `INSERT INTO document_types (name, type, description, requirements, fee, processing_days) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [docType.name, docType.type, docType.description, docType.requirements, docType.fee, docType.processing_days]
            );

            console.log(`✓ Created document type: "${docType.name}" (${docType.type}) - ₱${docType.fee}`);
        }

        console.log('\n✅ Document types seeding completed successfully!');
        console.log(`Total barangay documents: ${documentTypes.filter(d => d.type === 'barangay').length}`);
        console.log(`Total municipal documents: ${documentTypes.filter(d => d.type === 'municipal').length}`);

    } catch (error) {
        console.error('❌ Error seeding document types:', error);
        throw error;
    } finally {
        process.exit();
    }
};

seedDocumentTypes();
