import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'your_secret_key';





console.log(`Server is running on port ${PORT}`);// In-memory user storage
