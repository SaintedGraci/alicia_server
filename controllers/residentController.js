const Resident = require('../models/residentModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const residentController = {
    // Create resident profile (after user is created)
    createResident: async (req, res) => {
        const { userId, barangayId, firstName, lastName, middleName, address, phone } = req.body;
        try {
            const result = await Resident.create({ userId, barangayId, firstName, lastName, middleName, address, phone });
            res.status(201).json({ message: 'Resident created successfully', residentId: result.insertId });
        } catch (error) {
            res.status(500).json({ message: 'Failed to create resident', error: error.message });
        }
    },

    // Get resident by ID
    getResidentById: async (req, res) => {
        const residentId = req.params.id;
        try {
            const resident = await Resident.findById(residentId);
            if (!resident) {
                return res.status(404).json({ message: 'Resident not found' });
            }
            res.status(200).json({ resident });
        } catch (error) {
            res.status(500).json({ message: 'Failed to retrieve resident', error: error.message });
        }
    },

    // Get resident by user ID
    getResidentByUserId: async (req, res) => {
        const userId = req.params.userId;
        try {
            const resident = await Resident.findByUser(userId);
            if (!resident) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Resident not found' 
                });
            }
            res.status(200).json({ 
                success: true,
                data: resident 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: 'Failed to retrieve resident', 
                error: error.message 
            });
        }
    },

    // Get residents by barangay
    getResidentsByBarangay: async (req, res) => {
        const barangayId = req.params.barangayId;
        try {
            const residents = await Resident.findByBarangay(barangayId);
            res.status(200).json({ residents });
        } catch (error) {
            res.status(500).json({ message: 'Failed to retrieve residents', error: error.message });
        }
    },

    // Update resident
    updateResident: async (req, res) => {
        const residentId = req.params.id;
        try {
            const result = await Resident.updateResident(residentId, req.body);
            res.status(200).json({ message: 'Resident updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to update resident', error: error.message });
        }
    }, 

    deleteResident: async (req, res) => {
        const residentId = req.params.id;
        try {
            await Resident.deleteResident(residentId);
            res.status(200).json({ message: 'Resident deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete resident', error: error.message });
        }
    },


    getallResident: async (req, res) => {
        try {
            const [users] = await db.execute('SELECT id, username, email, role FROM users');
            res.status(200).json({ users });
        } catch (error) {
            res.status(500).json({ message: 'Failed to retrieve users', error: error.message });
        }
    },

    deleteUser: async (req, res) => {
        const userId = req.params.id;
        try {
            await db.execute('DELETE FROM users WHERE id = ?', [userId]);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete user', error: error.message });
        }
    },

    addResident: async (req, res) => {
        const { username, password, email, role } = req.body;
        try {
            const result = await User.create({ username, password, email, role });
            res.status(201).json({ message: 'User added successfully', userId: result.insertId });
        } catch (error) {
            res.status(500).json({ message: 'Failed to add user', error: error.message });
        }
    }
};

module.exports = residentController;