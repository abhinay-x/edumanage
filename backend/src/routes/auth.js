// src/routes/auth.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, db } = require('../config/firebase');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 }),
  body('role').isIn(['student', 'teacher', 'super_admin']),
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
];

// Register endpoint
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, role, additionalData = {} } = req.body;

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // Create user document in Firestore
    const userData = {
      uid: userRecord.uid,
      email: userRecord.email,
      firstName,
      lastName,
      role,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      profile: {
        avatar: null,
        phone: additionalData.phone || null,
        address: null,
        ...additionalData
      }
    };

    await db.collection('users').doc(userRecord.uid).set(userData);

    // Create role-specific document
    if (role === 'student') {
      await db.collection('students').doc(userRecord.uid).set({
        userId: userRecord.uid,
        rollNumber: null,
        classId: null,
        admissionDate: new Date(),
        parentContact: additionalData.parentContact || null,
      });
    } else if (role === 'teacher') {
      await db.collection('teachers').doc(userRecord.uid).set({
        userId: userRecord.uid,
        employeeId: null,
        department: additionalData.department || null,
        subjects: [],
        classes: [],
        joiningDate: new Date(),
      });
    }

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        role,
      },
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
});

// Login endpoint (for additional backend validation)
router.post('/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    // Get user from Firestore
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    
    if (snapshot.empty) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if (!userData.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    res.json({
      success: true,
      message: 'Login validation successful',
      user: userData,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const userData = userDoc.data();
    
    // Get role-specific data
    let roleData = {};
    if (userData.role === 'student') {
      const studentDoc = await db.collection('students').doc(req.user.uid).get();
      if (studentDoc.exists) {
        roleData = studentDoc.data();
      }
    } else if (userData.role === 'teacher') {
      const teacherDoc = await db.collection('teachers').doc(req.user.uid).get();
      if (teacherDoc.exists) {
        roleData = teacherDoc.data();
      }
    }

    res.json({
      success: true,
      user: {
        ...userData,
        roleData,
      },
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
    });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;
    
    const updateData = {
      updatedAt: new Date(),
    };

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone !== undefined) updateData['profile.phone'] = phone;
    if (address !== undefined) updateData['profile.address'] = address;

    await db.collection('users').doc(req.user.uid).update(updateData);

    res.json({
      success: true,
      message: 'Profile updated successfully',
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
});

// Verify email endpoint
router.post('/verify-email', authMiddleware, async (req, res) => {
  try {
    await auth.updateUser(req.user.uid, {
      emailVerified: true,
    });

    await db.collection('users').doc(req.user.uid).update({
      emailVerified: true,
      updatedAt: new Date(),
    });

    res.json({
      success: true,
      message: 'Email verified successfully',
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed',
    });
  }
});

module.exports = router;