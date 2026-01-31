const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModels');
const db = require('../config/db');

const seedAdmin = async () => {
    try {
        const username = 'admin';
        const password = 'admin123';
        const email = 'admin@example.com';
        const role = 'admin';
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingAdmin = await User.findByUsername(username);
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }
        await User.create({ username, password: hashedPassword, email, role });
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};
seedAdmin().then(() => process.exit());
