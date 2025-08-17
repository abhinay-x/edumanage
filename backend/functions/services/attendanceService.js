const admin = require('firebase-admin');
const { validateAttendanceStatus } = require('../utils/validationHelpers');

const db = admin.firestore();

// Mark attendance for multiple students
const markAttendance = async (attendanceData, markerUid) => {
  try {
    const { classId, date, attendanceRecords } = attendanceData;
    const batch = db.batch();

    // Validate date format
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }

    // Process each attendance record
    attendanceRecords.forEach(record => {
      if (!validateAttendanceStatus(record.status)) {
        throw new Error(`Invalid attendance status: ${record.status}`);
      }

      const attendanceId = `${classId}_${record.studentId}_${date}`;
      const attendanceRef = db.collection('attendance').doc(attendanceId);
      
      batch.set(attendanceRef, {
        classId,
        studentId: record.studentId,
        date,
        status: record.status,
        notes: record.notes || '',
        markedBy: markerUid,
        markedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    });

    await batch.commit();

    // Check for attendance alerts
    await checkAttendanceAlerts(classId, attendanceRecords);

    return { success: true, recordsProcessed: attendanceRecords.length };
  } catch (error) {
    console.error('Error marking attendance:', error);
    throw error;
  }
};

// Update single attendance record
const updateAttendance = async (attendanceId, updateData, updaterUid) => {
  try {
    if (updateData.status && !validateAttendanceStatus(updateData.status)) {
      throw new Error(`Invalid attendance status: ${updateData.status}`);
    }

    const updateDoc = {
      ...updateData,
      updatedBy: updaterUid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('attendance').doc(attendanceId).update(updateDoc);
    return { success: true };
  } catch (error) {
    console.error('Error updating attendance:', error);
    throw error;
  }
};

// Get attendance for a class on a specific date
const getClassAttendance = async (classId, date) => {
  try {
    const attendanceSnapshot = await db.collection('attendance')
      .where('classId', '==', classId)
      .where('date', '==', date)
      .get();

    const attendanceRecords = attendanceSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Get enrolled students for this class
    const enrollmentsSnapshot = await db.collection('enrollments')
      .where('classId', '==', classId)
      .where('status', '==', 'active')
      .get();

    const enrolledStudents = [];
    for (const enrollment of enrollmentsSnapshot.docs) {
      const studentId = enrollment.data().studentId;
      const studentDoc = await db.collection('users').doc(studentId).get();
      if (studentDoc.exists) {
        const studentData = studentDoc.data();
        const attendanceRecord = attendanceRecords.find(record => record.studentId === studentId);
        
        enrolledStudents.push({
          studentId,
          studentName: `${studentData.firstName} ${studentData.lastName}`,
          email: studentData.email,
          attendance: attendanceRecord || null
        });
      }
    }

    return {
      classId,
      date,
      students: enrolledStudents,
      totalStudents: enrolledStudents.length,
      markedCount: attendanceRecords.length
    };
  } catch (error) {
    console.error('Error getting class attendance:', error);
    throw error;
  }
};

// Get student attendance history
const getStudentAttendance = async (studentId, classId, startDate, endDate) => {
  try {
    let query = db.collection('attendance')
      .where('studentId', '==', studentId);

    if (classId) {
      query = query.where('classId', '==', classId);
    }

    if (startDate) {
      query = query.where('date', '>=', startDate);
    }

    if (endDate) {
      query = query.where('date', '<=', endDate);
    }

    const attendanceSnapshot = await query.orderBy('date', 'desc').get();

    const attendanceRecords = attendanceSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Calculate statistics
    const stats = {
      totalDays: attendanceRecords.length,
      present: attendanceRecords.filter(r => r.status === 'present').length,
      absent: attendanceRecords.filter(r => r.status === 'absent').length,
      late: attendanceRecords.filter(r => r.status === 'late').length,
      excused: attendanceRecords.filter(r => r.status === 'excused').length
    };

    stats.attendanceRate = stats.totalDays > 0 
      ? ((stats.present + stats.late) / stats.totalDays) * 100 
      : 0;

    return {
      studentId,
      classId,
      startDate,
      endDate,
      records: attendanceRecords,
      statistics: stats
    };
  } catch (error) {
    console.error('Error getting student attendance:', error);
    throw error;
  }
};

// Get attendance statistics for a class
const getClassAttendanceStats = async (classId, startDate, endDate) => {
  try {
    let query = db.collection('attendance').where('classId', '==', classId);

    if (startDate) {
      query = query.where('date', '>=', startDate);
    }

    if (endDate) {
      query = query.where('date', '<=', endDate);
    }

    const attendanceSnapshot = await query.get();

    const stats = {
      totalRecords: 0,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      excusedCount: 0,
      attendanceRate: 0
    };

    attendanceSnapshot.docs.forEach(doc => {
      const data = doc.data();
      stats.totalRecords++;
      
      switch (data.status) {
        case 'present':
          stats.presentCount++;
          break;
        case 'absent':
          stats.absentCount++;
          break;
        case 'late':
          stats.lateCount++;
          break;
        case 'excused':
          stats.excusedCount++;
          break;
      }
    });

    if (stats.totalRecords > 0) {
      stats.attendanceRate = ((stats.presentCount + stats.lateCount) / stats.totalRecords) * 100;
    }

    return stats;
  } catch (error) {
    console.error('Error getting class attendance statistics:', error);
    throw error;
  }
};

// Check for attendance alerts (low attendance)
const checkAttendanceAlerts = async (classId, attendanceRecords) => {
  try {
    const absentStudents = attendanceRecords.filter(record => record.status === 'absent');
    
    for (const record of absentStudents) {
      // Get student's recent attendance
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentAttendance = await db.collection('attendance')
        .where('studentId', '==', record.studentId)
        .where('classId', '==', classId)
        .where('date', '>=', thirtyDaysAgo.toISOString().split('T')[0])
        .get();

      const totalDays = recentAttendance.size;
      const absentDays = recentAttendance.docs.filter(doc => doc.data().status === 'absent').length;
      const attendanceRate = totalDays > 0 ? ((totalDays - absentDays) / totalDays) * 100 : 100;

      // Alert if attendance rate is below 75%
      if (attendanceRate < 75 && totalDays >= 5) {
        await createAttendanceAlert(record.studentId, classId, attendanceRate, absentDays);
      }
    }
  } catch (error) {
    console.error('Error checking attendance alerts:', error);
  }
};

// Create attendance alert notification
const createAttendanceAlert = async (studentId, classId, attendanceRate, absentDays) => {
  try {
    // Get student and class information
    const studentDoc = await db.collection('users').doc(studentId).get();
    const classDoc = await db.collection('classes').doc(classId).get();

    if (!studentDoc.exists || !classDoc.exists) return;

    const student = studentDoc.data();
    const classData = classDoc.data();

    // Create notification for teacher
    await db.collection('notifications').add({
      title: 'Low Attendance Alert',
      message: `${student.firstName} ${student.lastName} has low attendance (${Math.round(attendanceRate)}%) in ${classData.name}`,
      recipients: [classData.teacherId],
      type: 'attendance_alert',
      senderId: 'system',
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      isRead: false,
      studentId,
      classId,
      attendanceRate,
      absentDays
    });

    // Create notification for student
    await db.collection('notifications').add({
      title: 'Attendance Notice',
      message: `Your attendance in ${classData.name} is below the required threshold. Please improve your attendance.`,
      recipients: [studentId],
      type: 'attendance_warning',
      senderId: 'system',
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      isRead: false,
      classId,
      attendanceRate
    });

    // Notify parent if student has parent email
    if (student.parentEmail) {
      await db.collection('notifications').add({
        title: 'Student Attendance Alert',
        message: `Your child ${student.firstName} ${student.lastName} has low attendance (${Math.round(attendanceRate)}%) in ${classData.name}`,
        recipients: [student.parentEmail],
        type: 'parent_attendance_alert',
        senderId: 'system',
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        isRead: false,
        studentId,
        classId,
        attendanceRate
      });
    }
  } catch (error) {
    console.error('Error creating attendance alert:', error);
  }
};

// Generate attendance summary for a period
const generateAttendanceSummary = async (classId, startDate, endDate) => {
  try {
    const attendanceSnapshot = await db.collection('attendance')
      .where('classId', '==', classId)
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .get();

    const enrollmentsSnapshot = await db.collection('enrollments')
      .where('classId', '==', classId)
      .where('status', '==', 'active')
      .get();

    const studentSummaries = {};

    // Initialize student summaries
    for (const enrollment of enrollmentsSnapshot.docs) {
      const studentId = enrollment.data().studentId;
      const studentDoc = await db.collection('users').doc(studentId).get();
      
      if (studentDoc.exists) {
        const student = studentDoc.data();
        studentSummaries[studentId] = {
          studentId,
          studentName: `${student.firstName} ${student.lastName}`,
          email: student.email,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
          total: 0,
          attendanceRate: 0
        };
      }
    }

    // Process attendance records
    attendanceSnapshot.docs.forEach(doc => {
      const record = doc.data();
      if (studentSummaries[record.studentId]) {
        studentSummaries[record.studentId][record.status]++;
        studentSummaries[record.studentId].total++;
      }
    });

    // Calculate attendance rates
    Object.values(studentSummaries).forEach(summary => {
      if (summary.total > 0) {
        summary.attendanceRate = ((summary.present + summary.late) / summary.total) * 100;
      }
    });

    return {
      classId,
      startDate,
      endDate,
      students: Object.values(studentSummaries),
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating attendance summary:', error);
    throw error;
  }
};

module.exports = {
  markAttendance,
  updateAttendance,
  getClassAttendance,
  getStudentAttendance,
  getClassAttendanceStats,
  generateAttendanceSummary
};
