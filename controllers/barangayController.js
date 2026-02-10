const db = require('../config/db.js');
const bcrypt = require('bcryptjs'); 
const barangayModel = require('../models/barangayModel.js');
const userModel = require('../models/userModels.js');


const barangayController = {
    getAllBarangays: async (req, res) => {
        try {   
            const [barangays] = await db.execute('SELECT id, name, municipality_id, contact_email, contact_phone FROM barangays');
            res.status(200).json({ 
                success: true,
                data: barangays 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: 'Failed to retrieve barangays', 
                error: error.message 
            });
        }
    },

    deleteBarangay: async (req, res) => {
        const barangayId = req.params.id;
        try {
            await db.execute('DELETE FROM barangays WHERE id = ?', [barangayId]);
            res.status(200).json({ message: 'Barangay deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete barangay', error: error.message });
        }
    },

    addBarangay: async (req, res) => {
        const { name, municipalityId, contactEmail, contactPhone } = req.body;
        try {
            const result = await barangayModel.create({ name, municipalityId, contactEmail, contactPhone });
            res.status(201).json({ message: 'Barangay added successfully', barangayId: result.insertId });
        } catch (error) {
            res.status(500).json({ message: 'Failed to add barangay', error: error.message });
        }
    },
    
    getBarangayById: async (req, res) => {
        const barangayId = req.params.id;
        try {
            const barangay = await barangayModel.findById(barangayId);
            if (!barangay) {
                return res.status(404).json({ message: 'Barangay not found' });
            }
            res.status(200).json({ barangay });
        }
        catch (error) {
            res.status(500).json({ message: 'Failed to retrieve barangay', error: error.message });
        }
    },

    getBarangayByName: async (req, res) => {
        const name = req.params.name;
        try {
            const barangay = await barangayModel.findByName(name);
            if (!barangay) {
                return res.status(404).json({ message: 'Barangay not found' });
            }
            res.status(200).json({ barangay });
        }
        catch (error) {
            res.status(500).json({ message: 'Failed to retrieve barangay', error: error.message });
        }
    },

    getBarangayByMunicipality: async (req, res) => {
        const municipalityId = req.params.municipalityId;
        try {
            const barangays = await barangayModel.findByMunicipality(municipalityId);
            res.status(200).json({ barangays });
        }
        catch (error) {
            res.status(500).json({ message: 'Failed to retrieve barangays', error: error.message });
        }
    },

    updateBarangay: async (req, res) => {
        const barangayId = req.params.id;
        try {
            const result = await barangayModel.updateBarangay(barangayId, req.body);
            res.status(200).json({ message: 'Barangay updated successfully' });
        }
        catch (error) {
            res.status(500).json({ message: 'Failed to update barangay', error: error.message });
        }
    },

    deleteBarangay: async (req, res) => {
        const barangayId = req.params.id;
        try {
            await barangayModel.deleteBarangay(barangayId);
            res.status(200).json({ message: 'Barangay deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ message: 'Failed to delete barangay', error: error.message });
        }
    }

};

module.exports = barangayController;
