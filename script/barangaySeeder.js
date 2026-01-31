const db = require('../config/db');
const User = require('../models/userModels');


const seedBarangays = async () => {
    try {
        const username = 'barangay_tabaoan';
        const password = 'tabaoan123';
        const email = 'barangay_tabaoan@example.com';
        const role = 'barangay';
        const existingBarangay = await User.findByUsername(username);
        if (existingBarangay) {
            console.log('Barangay user already exists');
            return;
        }
        await User.create({ username, password, email, role });
        console.log('Barangay user created successfully');
    } catch (error) {
        console.error('Error seeding barangay user:', error);
    }
};
seedBarangays().then(() => process.exit());
