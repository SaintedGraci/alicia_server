const db = require('../config/db');
const User = require('../models/userModels');


const seedMunicipality = async () => {
    try {
        const username = 'municipality_alicia';
        const password = 'alicia123';
        const email = 'municipality_alicia@example.com';
        const role = 'municipality';
        const existingMunicipality = await User.findByUsername(username);
        if (existingMunicipality) {
            console.log('Municipality user already exists');
            return;
        }
    } catch (error) {
        console.error('Error seeding municipality user:', error);
    }
};
seedMunicipality().then(() => process.exit());