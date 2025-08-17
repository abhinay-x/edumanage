// src/middleware/authMiddleware.js
const { auth } = require('../config/firebase');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided or invalid format',
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);
    
    // Add user info to request object
    req.user = decodedToken;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

module.exports = authMiddleware;