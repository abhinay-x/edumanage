const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

// Import services
const authService = require('./services/authService');
const academicService = require('./services/academicService');
const assignmentService = require('./services/assignmentService');
const attendanceService = require('./services/attendanceService');
const messagingService = require('./services/messagingService');
const storageService = require('./services/storageService');
const analyticsService = require('./services/analyticsService');

// Import utilities
const { validateUserData, validateAssignmentData, validateGradeData, sanitizeUserData } = require('./utils/validationHelpers');
const { sendEmail, sendBulkEmail } = require('./utils/emailService');
const { generateAttendanceReport, generateGradeReport, generateStudentProgressReport, generateTeacherPerformanceReport } = require('./utils/reportGenerator');

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

// Helper function to verify user role
const verifyRole = async (uid, allowedRoles) => {
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      throw new Error('User not found');
    }
    const userData = userDoc.data();
    return allowedRoles.includes(userData.role);
  } catch (error) {
    console.error('Error verifying role:', error);
    return false;
  }
};

// ===== USER MANAGEMENT FUNCTIONS =====
exports.createUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const isAuthorized = await verifyRole(context.auth.uid, ['super_admin']);
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Only super admins can create users');
  }

  try {
    return await authService.createUserWithRole(data, context.auth.uid);
  } catch (error) {
    console.error('Error in createUser function:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.updateUserProfile = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { uid, updateData } = data;
  const isAuthorized = await verifyRole(context.auth.uid, ['super_admin']) || context.auth.uid === uid;
  
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Insufficient permissions');
  }

  try {
    return await authService.updateUserProfile(uid, updateData, context.auth.uid);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.deactivateUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const isAuthorized = await verifyRole(context.auth.uid, ['super_admin']);
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Only super admins can deactivate users');
  }

  try {
    return await authService.deactivateUser(data.uid, context.auth.uid);
  } catch (error) {
    console.error('Error deactivating user:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.bulkImportUsers = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const isAuthorized = await verifyRole(context.auth.uid, ['super_admin']);
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Only super admins can bulk import users');
  }

  try {
    return await authService.bulkImportUsers(data.usersData, context.auth.uid);
  } catch (error) {
    console.error('Error bulk importing users:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ===== ACADEMIC MANAGEMENT FUNCTIONS =====
exports.createAcademicYear = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const isAuthorized = await verifyRole(context.auth.uid, ['super_admin']);
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Only super admins can create academic years');
  }

  try {
    return await academicService.createAcademicYear(data, context.auth.uid);
  } catch (error) {
    console.error('Error creating academic year:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.createSubject = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const isAuthorized = await verifyRole(context.auth.uid, ['super_admin']);
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Only super admins can create subjects');
  }

  try {
    return await academicService.createSubject(data, context.auth.uid);
  } catch (error) {
    console.error('Error creating subject:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.createClass = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const isAuthorized = await verifyRole(context.auth.uid, ['super_admin']);
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Only super admins can create classes');
  }

  try {
    return await academicService.createClass(data, context.auth.uid);
  } catch (error) {
    console.error('Error creating class:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.setActiveAcademicYear = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const isAuthorized = await verifyRole(context.auth.uid, ['super_admin']);
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Only super admins can set active academic year');
  }

  try {
    return await academicService.setActiveAcademicYear(data.yearId, context.auth.uid);
  } catch (error) {
    console.error('Error setting active academic year:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ===== ENROLLMENT FUNCTIONS =====
exports.enrollStudentInClass = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const isAuthorized = await verifyRole(context.auth.uid, ['super_admin', 'teacher']);
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Insufficient permissions');
  }

  try {
    return await academicService.enrollStudentInClass(data, context.auth.uid);
  } catch (error) {
    console.error('Error enrolling student:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ===== ASSIGNMENT FUNCTIONS =====
exports.createAssignment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const isAuthorized = await verifyRole(context.auth.uid, ['teacher', 'super_admin']);
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Only teachers can create assignments');
  }

  try {
    return await assignmentService.createAssignment(data, context.auth.uid);
  } catch (error) {
    console.error('Error creating assignment:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.submitAssignment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const isAuthorized = await verifyRole(context.auth.uid, ['student']);
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Only students can submit assignments');
  }

  try {
    return await assignmentService.submitAssignment(data, context.auth.uid);
  } catch (error) {
    console.error('Error submitting assignment:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.gradeSubmission = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const isAuthorized = await verifyRole(context.auth.uid, ['teacher', 'super_admin']);
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Only teachers can grade submissions');
  }

  try {
    return await assignmentService.gradeSubmission(data.submissionId, data.gradeData, context.auth.uid);
  } catch (error) {
    console.error('Error grading submission:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.getAssignmentStatistics = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const isAuthorized = await verifyRole(context.auth.uid, ['teacher', 'super_admin']);
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Insufficient permissions');
  }

  try {
    return await assignmentService.getAssignmentStatistics(data.assignmentId);
  } catch (error) {
    console.error('Error getting assignment statistics:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ===== ATTENDANCE FUNCTIONS =====
exports.markAttendance = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const isAuthorized = await verifyRole(context.auth.uid, ['teacher', 'super_admin']);
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Only teachers can mark attendance');
  }

  try {
    return await attendanceService.markAttendance(data, context.auth.uid);
  } catch (error) {
    console.error('Error marking attendance:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.getClassAttendance = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const isAuthorized = await verifyRole(context.auth.uid, ['teacher', 'super_admin']);
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Insufficient permissions');
  }

  try {
    return await attendanceService.getClassAttendance(data.classId, data.date);
  } catch (error) {
    console.error('Error getting class attendance:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.getStudentAttendance = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { studentId } = data;
  const isAuthorized = await verifyRole(context.auth.uid, ['teacher', 'super_admin']) || context.auth.uid === studentId;
  
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Insufficient permissions');
  }

  try {
    return await attendanceService.getStudentAttendance(studentId, data.classId, data.startDate, data.endDate);
  } catch (error) {
    console.error('Error getting student attendance:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ===== MESSAGING FUNCTIONS =====
exports.sendMessage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    return await messagingService.sendMessage(data, context.auth.uid);
  } catch (error) {
    console.error('Error sending message:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.createAnnouncement = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const isAuthorized = await verifyRole(context.auth.uid, ['teacher', 'super_admin']);
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Insufficient permissions');
  }

  try {
    return await messagingService.createAnnouncement(data, context.auth.uid);
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.getUserMessages = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    return await messagingService.getUserMessages(context.auth.uid, data.type, data.limit);
  } catch (error) {
    console.error('Error getting user messages:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.markMessageAsRead = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    return await messagingService.markMessageAsRead(data.messageId, context.auth.uid);
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ===== STORAGE FUNCTIONS =====
exports.uploadFile = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const { fileBuffer, fileName, folder, metadata } = data;
    return await storageService.uploadFile(fileBuffer, fileName, folder, {
      ...metadata,
      uploadedBy: context.auth.uid
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.uploadProfilePicture = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const { fileBuffer, fileName } = data;
    return await storageService.uploadProfilePicture(fileBuffer, fileName, context.auth.uid);
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.deleteFile = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    return await storageService.deleteFile(data.fileId, context.auth.uid);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ===== ANALYTICS FUNCTIONS =====
exports.getDashboardAnalytics = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const userDoc = await db.collection('users').doc(context.auth.uid).get();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User not found');
    }

    const userData = userDoc.data();
    return await analyticsService.generateDashboardAnalytics(userData.role, context.auth.uid, data.timeframe);
  } catch (error) {
    console.error('Error getting dashboard analytics:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ===== REPORT FUNCTIONS =====
exports.generateAttendanceReport = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const isAuthorized = await verifyRole(context.auth.uid, ['teacher', 'super_admin']);
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Insufficient permissions');
  }

  try {
    return await generateAttendanceReport(data.classId, data.startDate, data.endDate);
  } catch (error) {
    console.error('Error generating attendance report:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.generateGradeReport = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const isAuthorized = await verifyRole(context.auth.uid, ['teacher', 'super_admin']);
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Insufficient permissions');
  }

  try {
    return await generateGradeReport(data.classId, data.subjectId, data.academicYearId);
  } catch (error) {
    console.error('Error generating grade report:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.generateStudentProgressReport = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { studentId } = data;
  const isAuthorized = await verifyRole(context.auth.uid, ['teacher', 'super_admin']) || context.auth.uid === studentId;
  
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Insufficient permissions');
  }

  try {
    return await generateStudentProgressReport(studentId, data.academicYearId);
  } catch (error) {
    console.error('Error generating student progress report:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ===== AUTOMATED TRIGGERS AND SCHEDULED FUNCTIONS =====

// Trigger when a new user is created
exports.onUserCreate = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const userData = snap.data();
    
    try {
      // Send welcome notification
      await db.collection('notifications').add({
        title: 'Welcome to EduManage!',
        message: `Welcome ${userData.firstName}! Your account has been created successfully.`,
        recipients: [context.params.userId],
        type: 'welcome',
        senderId: 'system',
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        isRead: false
      });

      console.log(`Welcome notification sent to user: ${userData.email}`);
    } catch (error) {
      console.error('Error sending welcome notification:', error);
    }
  });

// Trigger when assignment is due soon
exports.assignmentDueReminder = functions.pubsub
  .schedule('every day 09:00')
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      // Get assignments due tomorrow
      const assignmentsSnapshot = await db.collection('assignments')
        .where('dueDate', '==', tomorrowStr)
        .where('status', '==', 'active')
        .get();

      const batch = db.batch();

      for (const assignmentDoc of assignmentsSnapshot.docs) {
        const assignment = assignmentDoc.data();
        
        // Get enrolled students for this class
        const enrollmentsSnapshot = await db.collection('enrollments')
          .where('classId', '==', assignment.classId)
          .where('status', '==', 'active')
          .get();

        const studentIds = enrollmentsSnapshot.docs.map(doc => doc.data().studentId);

        if (studentIds.length > 0) {
          const notificationRef = db.collection('notifications').doc();
          batch.set(notificationRef, {
            title: 'Assignment Due Tomorrow',
            message: `Reminder: "${assignment.title}" is due tomorrow.`,
            recipients: studentIds,
            type: 'assignment_reminder',
            senderId: 'system',
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
            isRead: false,
            assignmentId: assignmentDoc.id
          });
        }
      }

      await batch.commit();
      console.log(`Sent assignment reminders for ${assignmentsSnapshot.size} assignments`);
    } catch (error) {
      console.error('Error sending assignment reminders:', error);
    }
  });

// Weekly backup function
exports.weeklyBackup = functions.pubsub
  .schedule('every sunday 02:00')
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    try {
      console.log('Weekly backup initiated at:', new Date().toISOString());
      
      // Clean up old files
      await storageService.cleanupOldFiles(365);
      
      // Additional backup logic can be added here
      
      return null;
    } catch (error) {
      console.error('Error during weekly backup:', error);
    }
  });

// HTTP endpoint for health check
exports.healthCheck = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        auth: 'operational',
        firestore: 'operational',
        storage: 'operational',
        functions: 'operational'
      }
    });
  });
});

// ===== NOTIFICATION FUNCTIONS =====
exports.sendNotification = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const isAuthorized = await verifyRole(context.auth.uid, ['teacher', 'super_admin']);
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Insufficient permissions');
  }

  try {
    const { title, message, recipients, type } = data;
    
    const notificationData = {
      title,
      message,
      recipients,
      type,
      senderId: context.auth.uid,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      isRead: false
    };

    const notificationRef = await db.collection('notifications').add(notificationData);
    return { success: true, notificationId: notificationRef.id };
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.getUserNotifications = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const notificationsSnapshot = await db.collection('notifications')
      .where('recipients', 'array-contains', context.auth.uid)
      .orderBy('sentAt', 'desc')
      .limit(data.limit || 50)
      .get();

    const notifications = notificationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return notifications;
  } catch (error) {
    console.error('Error getting user notifications:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.markNotificationAsRead = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    await db.collection('notifications').doc(data.notificationId).update({
      isRead: true,
      readAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ===== UTILITY FUNCTIONS =====
exports.getClassStatistics = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const isAuthorized = await verifyRole(context.auth.uid, ['teacher', 'super_admin']);
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Insufficient permissions');
  }

  try {
    return await academicService.getClassStatistics(data.classId);
  } catch (error) {
    console.error('Error getting class statistics:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.getStorageUsage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    return await storageService.getStorageUsage(context.auth.uid);
  } catch (error) {
    console.error('Error getting storage usage:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ===== EMAIL FUNCTIONS =====
exports.sendWelcomeEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const isAuthorized = await verifyRole(context.auth.uid, ['super_admin']);
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Only super admins can send welcome emails');
  }

  try {
    return await sendEmail(data.email, 'welcome', data.userData);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Notification System
exports.sendNotification = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const isAuthorized = await verifyRole(context.auth.uid, ['teacher', 'super_admin']);
  if (!isAuthorized) {
    throw new functions.https.HttpsError('permission-denied', 'Insufficient permissions');
  }

  try {
    const { title, message, recipients, type } = data;
    
    const notificationData = {
      title,
      message,
      recipients,
      type,
      senderId: context.auth.uid,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      isRead: false
    };

    const notificationRef = await db.collection('notifications').add(notificationData);
    return { success: true, notificationId: notificationRef.id };
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send notification');
  }
});

// Triggers for automatic operations

// Trigger when a new user is created
exports.onUserCreate = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const userData = snap.data();
    
    try {
      // Send welcome notification
      await db.collection('notifications').add({
        title: 'Welcome to EduManage!',
        message: `Welcome ${userData.firstName}! Your account has been created successfully.`,
        recipients: [context.params.userId],
        type: 'welcome',
        senderId: 'system',
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        isRead: false
      });

      console.log(`Welcome notification sent to user: ${userData.email}`);
    } catch (error) {
      console.error('Error sending welcome notification:', error);
    }
  });

// Trigger when assignment is due soon
exports.assignmentDueReminder = functions.pubsub
  .schedule('every day 09:00')
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      // Get assignments due tomorrow
      const assignmentsSnapshot = await db.collection('assignments')
        .where('dueDate', '==', tomorrowStr)
        .where('status', '==', 'active')
        .get();

      const batch = db.batch();

      for (const assignmentDoc of assignmentsSnapshot.docs) {
        const assignment = assignmentDoc.data();
        
        // Get enrolled students for this class
        const enrollmentsSnapshot = await db.collection('enrollments')
          .where('classId', '==', assignment.classId)
          .where('status', '==', 'active')
          .get();

        const studentIds = enrollmentsSnapshot.docs.map(doc => doc.data().studentId);

        if (studentIds.length > 0) {
          const notificationRef = db.collection('notifications').doc();
          batch.set(notificationRef, {
            title: 'Assignment Due Tomorrow',
            message: `Reminder: "${assignment.title}" is due tomorrow.`,
            recipients: studentIds,
            type: 'assignment_reminder',
            senderId: 'system',
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
            isRead: false,
            assignmentId: assignmentDoc.id
          });
        }
      }

      await batch.commit();
      console.log(`Sent assignment reminders for ${assignmentsSnapshot.size} assignments`);
    } catch (error) {
      console.error('Error sending assignment reminders:', error);
    }
  });

// Backup function (runs weekly)
exports.weeklyBackup = functions.pubsub
  .schedule('every sunday 02:00')
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    try {
      // This would typically export data to Cloud Storage
      // For now, we'll just log the backup operation
      console.log('Weekly backup initiated at:', new Date().toISOString());
      
      // You can implement actual backup logic here
      // Example: Export collections to Cloud Storage
      
      return null;
    } catch (error) {
      console.error('Error during weekly backup:', error);
    }
  });

// HTTP endpoint for health check
exports.healthCheck = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });
});
