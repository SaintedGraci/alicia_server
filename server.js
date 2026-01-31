const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors'); // Don't forget to import cors!
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT;
const SECRET_KEY = process.env.JWT_SECRET; // Use the one from .env

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});