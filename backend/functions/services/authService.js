const admin = require('firebase-admin');
const { validateUserData, sanitizeUserData } = require('../utils/validationHelpers');
const { sendEmail } = require('../utils/emailService');

const db = admin.firestore();
const auth = admin.auth();

// Create user with role-based permissions
const createUserWithRole = async (userData, creatorUid) => {
  try {
    // Validate input data
    const validation = validateUserData(userData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Sanitize user data
    const sanitizedData = sanitizeUserData(userData);

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: sanitizedData.email,
      password: userData.password,
      displayName: `${sanitizedData.firstName} ${sanitizedData.lastName}`,
      emailVerified: false
    });

    // Create user document in Firestore
    const userDoc = {
      uid: userRecord.uid,
      email: sanitizedData.email,
      firstName: sanitizedData.firstName,
      lastName: sanitizedData.lastName,
      role: sanitizedData.role,
      phoneNumber: sanitizedData.phoneNumber || '',
      address: sanitizedData.address || '',
      dateOfBirth: sanitizedData.dateOfBirth || null,
      profilePicture: '',
      isActive: true,
      createdBy: creatorUid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Add role-specific fields
    if (sanitizedData.role === 'student') {
      userDoc.studentId = sanitizedData.studentId || userRecord.uid.substring(0, 8).toUpperCase();
      userDoc.grade = sanitizedData.grade || null;
      userDoc.section = sanitizedData.section || '';
      userDoc.parentEmail = sanitizedData.parentEmail || '';
      userDoc.parentPhone = sanitizedData.parentPhone || '';
    } else if (sanitizedData.role === 'teacher') {
      userDoc.employeeId = sanitizedData.employeeId || userRecord.uid.substring(0, 8).toUpperCase();
      userDoc.department = sanitizedData.department || '';
      userDoc.subjects = sanitizedData.subjects || [];
      userDoc.qualifications = sanitizedData.qualifications || [];
      userDoc.experience = sanitizedData.experience || 0;
    } else if (sanitizedData.role === 'super_admin') {
      userDoc.employeeId = sanitizedData.employeeId || userRecord.uid.substring(0, 8).toUpperCase();
      userDoc.permissions = sanitizedData.permissions || ['all'];
    }

    await db.collection('users').doc(userRecord.uid).set(userDoc);

    // Send welcome email
    try {
      await sendEmail(sanitizedData.email, 'welcome', {
        firstName: sanitizedData.firstName,
        lastName: sanitizedData.lastName,
        email: sanitizedData.email,
        role: sanitizedData.role,
        employeeId: userDoc.employeeId,
        studentId: userDoc.studentId
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    return {
      success: true,
      uid: userRecord.uid,
      userData: userDoc
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update user profile
const updateUserProfile = async (uid, updateData, updaterUid) => {
  try {
    const sanitizedData = sanitizeUserData(updateData);
    
    const updateDoc = {
      ...sanitizedData,
      updatedBy: updaterUid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Remove undefined fields
    Object.keys(updateDoc).forEach(key => {
      if (updateDoc[key] === undefined) {
        delete updateDoc[key];
      }
    });

    await db.collection('users').doc(uid).update(updateDoc);

    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Deactivate user
const deactivateUser = async (uid, deactivatorUid) => {
  try {
    // Disable user in Firebase Auth
    await auth.updateUser(uid, { disabled: true });

    // Update user document
    await db.collection('users').doc(uid).update({
      isActive: false,
      deactivatedBy: deactivatorUid,
      deactivatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error deactivating user:', error);
    throw error;
  }
};

// Reactivate user
const reactivateUser = async (uid, activatorUid) => {
  try {
    // Enable user in Firebase Auth
    await auth.updateUser(uid, { disabled: false });

    // Update user document
    await db.collection('users').doc(uid).update({
      isActive: true,
      reactivatedBy: activatorUid,
      reactivatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error reactivating user:', error);
    throw error;
  }
};

// Reset user password
const resetUserPassword = async (email) => {
  try {
    await auth.generatePasswordResetLink(email);
    return { success: true };
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Bulk user import
const bulkImportUsers = async (usersData, creatorUid) => {
  const results = [];
  const batch = db.batch();

  for (const userData of usersData) {
    try {
      const result = await createUserWithRole(userData, creatorUid);
      results.push({
        email: userData.email,
        success: true,
        uid: result.uid
      });
    } catch (error) {
      results.push({
        email: userData.email,
        success: false,
        error: error.message
      });
    }
  }

  return results;
};

module.exports = {
  createUserWithRole,
  updateUserProfile,
  deactivateUser,
  reactivateUser,
  resetUserPassword,
  bulkImportUsers
};
