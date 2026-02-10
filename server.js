const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors'); // Don't forget to import cors!
const authRoutes = require('./routes/authRoutes');
const barangayRoutes = require('./routes/barangayRoutes');
const residentRoutes = require('./routes/residentRoutes');
const documentTypeRoutes = require('./routes/documentTypeRoutes');
const documentRequestRoutes = require('./routes/documentRequestRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/barangay', barangayRoutes);
app.use('/api/resident', residentRoutes);
app.use('/api/documentTypes', documentTypeRoutes);
app.use('/api/document-requests', documentRequestRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT;
const SECRET_KEY = process.env.JWT_SECRET; // Use the one from .env

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});