// src/middleware/roleMiddleware.js
const { db } = require('../config/firebase');

const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userDoc = await db.collection('users').doc(req.user.uid).get();
      
      if (!userDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      const userData = userDoc.data();
      
      if (!userData.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Account is deactivated',
        });
      }

      if (!allowedRoles.includes(userData.role)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
        });
      }

      req.userRole = userData.role;
      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authorization check failed',
      });
    }
  };
};

module.exports = requireRole;