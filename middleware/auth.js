    const jwt = require('jsonwebtoken');
const User = require('../models/userModels');

// Main authentication middleware - verifies JWT token
const authenticateToken = async (req, res, next) => {
    try {
        // 1. Get token from Authorization header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        // 2. Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
        }

        // 3. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Check if user still exists in database
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists'
            });
        }

        // 5. Check if user account is active
        if (!user.is_active) {
            return res.status(401).json({
                success: false,
                message: 'Account has been deactivated'
            });
        }

        // 6. Add user info to request object
        req.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            isActive: user.is_active
        };

        // 7. Continue to next middleware/route handler
        next();

    } catch (error) {
        // Handle different JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired'
            });
        }

        // Other errors
        return res.status(500).json({
            success: false,
            message: 'Authentication failed',
            error: error.message
        });
    }
};

// Optional authentication - doesn't block if no token
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            // No token provided, continue without user info
            req.user = null;
            return next();
        }

        // Token provided, try to verify it
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (user && user.is_active) {
            req.user = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                isActive: user.is_active
            };
        } else {
            req.user = null;
        }

        next();

    } catch (error) {
        // If token is invalid, just continue without user info
        req.user = null;
        next();
    }
};

// Middleware to check if user is logged in (simpler version)
const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }
    next();
};

// Generate JWT token (helper function)
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            role: user.role 
        },
        process.env.JWT_SECRET,
        { 
            expiresIn: process.env.JWT_EXPIRES_IN || '7d' 
        }
    );
};

// Verify token without middleware (helper function)
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = {
    authenticateToken,
    optionalAuth,
    requireAuth,
    generateToken,
    verifyToken
};