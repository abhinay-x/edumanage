const admin = require('firebase-admin');
const { validateAssignmentData } = require('../utils/validationHelpers');
const { sendBulkEmail } = require('../utils/emailService');

const db = admin.firestore();

// Assignment Management
const createAssignment = async (assignmentData, creatorUid) => {
  try {
    const validation = validateAssignmentData(assignmentData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const assignmentDoc = {
      title: assignmentData.title,
      description: assignmentData.description,
      instructions: assignmentData.instructions || '',
      classId: assignmentData.classId,
      subjectId: assignmentData.subjectId,
      teacherId: creatorUid,
      dueDate: assignmentData.dueDate,
      maxScore: assignmentData.maxScore || 100,
      attachments: assignmentData.attachments || [],
      submissionType: assignmentData.submissionType || 'file', // file, text, both
      allowLateSubmission: assignmentData.allowLateSubmission || false,
      latePenalty: assignmentData.latePenalty || 0,
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('assignments').add(assignmentDoc);

    // Notify enrolled students
    try {
      await notifyStudentsAboutAssignment(assignmentData.classId, assignmentDoc);
    } catch (notificationError) {
      console.error('Failed to notify students:', notificationError);
    }

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating assignment:', error);
    throw error;
  }
};

const updateAssignment = async (assignmentId, updateData, updaterUid) => {
  try {
    const updateDoc = {
      ...updateData,
      updatedBy: updaterUid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('assignments').doc(assignmentId).update(updateDoc);
    return { success: true };
  } catch (error) {
    console.error('Error updating assignment:', error);
    throw error;
  }
};

// Submission Management
const submitAssignment = async (submissionData, studentUid) => {
  try {
    const { assignmentId, content, attachments } = submissionData;

    // Check if assignment exists and is active
    const assignmentDoc = await db.collection('assignments').doc(assignmentId).get();
    if (!assignmentDoc.exists) {
      throw new Error('Assignment not found');
    }

    const assignment = assignmentDoc.data();
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const isLate = now > dueDate;

    if (isLate && !assignment.allowLateSubmission) {
      throw new Error('Late submissions are not allowed for this assignment');
    }

    // Check if student already submitted
    const existingSubmission = await db.collection('submissions')
      .where('assignmentId', '==', assignmentId)
      .where('studentId', '==', studentUid)
      .get();

    if (!existingSubmission.empty) {
      throw new Error('Assignment already submitted');
    }

    const submissionDoc = {
      assignmentId,
      studentId: studentUid,
      content: content || '',
      attachments: attachments || [],
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      isLate,
      status: 'submitted',
      grade: null,
      feedback: '',
      gradedAt: null,
      gradedBy: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('submissions').add(submissionDoc);
    return { success: true, id: docRef.id, isLate };
  } catch (error) {
    console.error('Error submitting assignment:', error);
    throw error;
  }
};

const gradeSubmission = async (submissionId, gradeData, graderUid) => {
  try {
    const { score, feedback, maxScore } = gradeData;

    if (score < 0 || score > maxScore) {
      throw new Error('Score must be between 0 and max score');
    }

    // Update submission with grade
    await db.collection('submissions').doc(submissionId).update({
      grade: score,
      feedback: feedback || '',
      gradedAt: admin.firestore.FieldValue.serverTimestamp(),
      gradedBy: graderUid,
      status: 'graded',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Get submission details for grade record
    const submissionDoc = await db.collection('submissions').doc(submissionId).get();
    const submission = submissionDoc.data();

    // Create grade record
    const gradeDoc = {
      studentId: submission.studentId,
      assignmentId: submission.assignmentId,
      submissionId: submissionId,
      score,
      maxScore,
      percentage: (score / maxScore) * 100,
      feedback: feedback || '',
      teacherId: graderUid,
      gradedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('grades').add(gradeDoc);

    // Notify student about grade
    try {
      await notifyStudentAboutGrade(submission.studentId, gradeDoc);
    } catch (notificationError) {
      console.error('Failed to notify student about grade:', notificationError);
    }

    return { success: true };
  } catch (error) {
    console.error('Error grading submission:', error);
    throw error;
  }
};

// Get assignment statistics
const getAssignmentStatistics = async (assignmentId) => {
  try {
    // Get all submissions for this assignment
    const submissionsSnapshot = await db.collection('submissions')
      .where('assignmentId', '==', assignmentId)
      .get();

    const totalSubmissions = submissionsSnapshot.size;
    let gradedCount = 0;
    let lateSubmissions = 0;
    let totalScore = 0;
    let maxPossibleScore = 0;

    submissionsSnapshot.docs.forEach(doc => {
      const submission = doc.data();
      if (submission.isLate) lateSubmissions++;
      if (submission.status === 'graded') {
        gradedCount++;
        totalScore += submission.grade;
        // Get max score from assignment
      }
    });

    // Get assignment details
    const assignmentDoc = await db.collection('assignments').doc(assignmentId).get();
    const assignment = assignmentDoc.data();
    maxPossibleScore = gradedCount * assignment.maxScore;

    const averageScore = gradedCount > 0 ? totalScore / gradedCount : 0;
    const averagePercentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;

    return {
      totalSubmissions,
      gradedCount,
      pendingGrading: totalSubmissions - gradedCount,
      lateSubmissions,
      averageScore: Math.round(averageScore * 100) / 100,
      averagePercentage: Math.round(averagePercentage * 100) / 100,
      maxScore: assignment.maxScore
    };
  } catch (error) {
    console.error('Error getting assignment statistics:', error);
    throw error;
  }
};

// Helper function to notify students about new assignment
const notifyStudentsAboutAssignment = async (classId, assignmentData) => {
  try {
    // Get enrolled students
    const enrollmentsSnapshot = await db.collection('enrollments')
      .where('classId', '==', classId)
      .where('status', '==', 'active')
      .get();

    const studentIds = enrollmentsSnapshot.docs.map(doc => doc.data().studentId);

    if (studentIds.length > 0) {
      // Create notification
      await db.collection('notifications').add({
        title: 'New Assignment Posted',
        message: `New assignment "${assignmentData.title}" has been posted. Due date: ${assignmentData.dueDate}`,
        recipients: studentIds,
        type: 'assignment_new',
        senderId: assignmentData.teacherId,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        isRead: false,
        assignmentId: assignmentData.id
      });
    }
  } catch (error) {
    console.error('Error notifying students about assignment:', error);
  }
};

// Helper function to notify student about grade
const notifyStudentAboutGrade = async (studentId, gradeData) => {
  try {
    await db.collection('notifications').add({
      title: 'Assignment Graded',
      message: `Your assignment has been graded. Score: ${gradeData.score}/${gradeData.maxScore}`,
      recipients: [studentId],
      type: 'grade_posted',
      senderId: gradeData.teacherId,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      isRead: false,
      gradeId: gradeData.id
    });
  } catch (error) {
    console.error('Error notifying student about grade:', error);
  }
};

// Get student submissions for a class
const getStudentSubmissions = async (studentId, classId) => {
  try {
    // Get assignments for the class
    const assignmentsSnapshot = await db.collection('assignments')
      .where('classId', '==', classId)
      .where('status', '==', 'active')
      .get();

    const submissions = [];

    for (const assignmentDoc of assignmentsSnapshot.docs) {
      const assignment = assignmentDoc.data();
      
      // Check if student has submitted
      const submissionSnapshot = await db.collection('submissions')
        .where('assignmentId', '==', assignmentDoc.id)
        .where('studentId', '==', studentId)
        .get();

      const submission = submissionSnapshot.empty ? null : submissionSnapshot.docs[0].data();

      submissions.push({
        assignmentId: assignmentDoc.id,
        assignment,
        submission,
        hasSubmitted: !submissionSnapshot.empty
      });
    }

    return submissions;
  } catch (error) {
    console.error('Error getting student submissions:', error);
    throw error;
  }
};

module.exports = {
  createAssignment,
  updateAssignment,
  submitAssignment,
  gradeSubmission,
  getAssignmentStatistics,
  getStudentSubmissions
};
