const bcrypt = require('bcryptjs');
const User = require('../models/userModels');
const Resident = require('../models/residentModel');
const db = require('../config/db');

const seedResident = async () => {
    try {   
        const username = 'resident';
        const password = 'resident123';
        const email = 'resident@example.com';
        const role = 'resident';
        
        // Check if user already exists
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            console.log('✓ Resident user already exists');
            
            // Check if resident profile exists
            const existingResident = await Resident.findByUser(existingUser.id);
            if (existingResident) {
                console.log('✓ Resident profile already exists');
                return;
            }
            
            // Create resident profile for existing user
            console.log('Creating resident profile for existing user...');
            const [barangays] = await db.execute('SELECT id FROM barangays LIMIT 1');
            if (barangays.length === 0) {
                console.log('❌ No barangays found. Please run barangay seeder first.');
                return;
            }
            
            await Resident.create({
                userId: existingUser.id,
                barangayId: barangays[0].id,
                firstName: 'Juan',
                lastName: 'Dela Cruz',
                middleName: 'Santos',
                address: '123 Main Street, Poblacion',
                phone: '09123456789'
            });
            console.log('✓ Resident profile created successfully');
            return;
        }
        
        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const userResult = await User.create({ username, password: hashedPassword, email, role });
        console.log('✓ Resident user created successfully');
        
        // Get a barangay ID for the resident
        const [barangays] = await db.execute('SELECT id FROM barangays LIMIT 1');
        if (barangays.length === 0) {
            console.log('❌ No barangays found. Please run barangay seeder first.');
            return;
        }
        
        // Create resident profile
        await Resident.create({
            userId: userResult.insertId,
            barangayId: barangays[0].id,
            firstName: 'Juan',
            lastName: 'Dela Cruz',
            middleName: 'Santos',
            address: '123 Main Street, Poblacion',
            phone: '09123456789'
        });
        console.log('✓ Resident profile created successfully');
        
        console.log('\n📋 Test Credentials:');
        console.log('Email: resident@example.com');
        console.log('Password: resident123');
        
    } catch (error) {
        console.error('❌ Error seeding resident:', error);
    }  
};

seedResident().then(() => process.exit());
