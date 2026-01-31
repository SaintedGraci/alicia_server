const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModels');
const db = require('../config/db');


const seedResident = async () => {
    try {   
        const username = 'resident';
        const password = 'resident123';
        const email = 'resident@example.com';
        const role = 'resident';
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingResident = await User.findByUsername(username);
        if (existingResident) {
            console.log('Resident user already exists');
            return;
        }
        await User.create({ username, password: hashedPassword, email, role });
        console.log('Resident user created successfully');
    } catch (error) {
        console.error('Error seeding resident user:', error);
    }  
};
seedResident().then(() => process.exit());