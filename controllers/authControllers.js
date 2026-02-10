const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModels');

exports.register = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await User.create({ 
            username, 
            password: hashedPassword, 
            email, 
            role: 'user' // Default role for new registrations
        });
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {   
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

exports.loginResident = async (req, res) => {
    const { email, password } = req.body;   
    try {
        const user = await User.findByEmail(email);
        if (!user || user.role !== 'resident') {
            return res.status(404).json({ message: 'Resident user not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

exports.loginBarangay = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (!user || user.role !== 'barangay') {
            return res.status(404).json({ message: 'Barangay user not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};


exports.loginMunicipal = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (!user || user.role !== 'municipal') {
            return res.status(404).json({ message: 'Municipal user not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }   
};



exports.registerResident = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await User.create({ 
            username, 
            password: hashedPassword,
            email,
            role: 'resident' // Role set to resident for this registration
        });
        res.status(201).json({ message: 'Resident registered successfully', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Resident registration failed', error: error.message });
    }
};


exports.registerBarangay = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await User.create({
            username,
            password: hashedPassword,
            email,
            role: 'barangay' // Role set to barangay for this registration
        });
        res.status(201).json({ message: 'Barangay registered successfully', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Barangay registration failed', error: error.message });
    }
};