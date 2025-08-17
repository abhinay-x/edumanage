const admin = require('firebase-admin');
const moment = require('moment');

const db = admin.firestore();

// Generate comprehensive analytics dashboard data
const generateDashboardAnalytics = async (userRole, userId, timeframe = '30d') => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    
    // Set date range based on timeframe
    switch (timeframe) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    let analytics = {};

    if (userRole === 'super_admin') {
      analytics = await generateSuperAdminAnalytics(startDate, endDate);
    } else if (userRole === 'teacher') {
      analytics = await generateTeacherAnalytics(userId, startDate, endDate);
    } else if (userRole === 'student') {
      analytics = await generateStudentAnalytics(userId, startDate, endDate);
    }

    return {
      ...analytics,
      timeframe,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating dashboard analytics:', error);
    throw error;
  }
};

// Super Admin Analytics
const generateSuperAdminAnalytics = async (startDate, endDate) => {
  try {
    // User statistics
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map(doc => doc.data());
    
    const userStats = {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      students: users.filter(u => u.role === 'student').length,
      teachers: users.filter(u => u.role === 'teacher').length,
      admins: users.filter(u => u.role === 'super_admin').length
    };

    // Academic statistics
    const academicYearsSnapshot = await db.collection('academicYears').get();
    const activeAcademicYear = academicYearsSnapshot.docs.find(doc => doc.data().isActive);
    
    const classesSnapshot = await db.collection('classes').get();
    const subjectsSnapshot = await db.collection('subjects').get();

    // Enrollment statistics
    const enrollmentsSnapshot = await db.collection('enrollments')
      .where('status', '==', 'active')
      .get();

    // Assignment statistics
    const assignmentsSnapshot = await db.collection('assignments')
      .where('createdAt', '>=', startDate)
      .where('createdAt', '<=', endDate)
      .get();

    // Attendance statistics
    const attendanceSnapshot = await db.collection('attendance')
      .where('date', '>=', startDate.toISOString().split('T')[0])
      .where('date', '<=', endDate.toISOString().split('T')[0])
      .get();

    const attendanceRecords = attendanceSnapshot.docs.map(doc => doc.data());
    const attendanceStats = {
      totalRecords: attendanceRecords.length,
      present: attendanceRecords.filter(r => r.status === 'present').length,
      absent: attendanceRecords.filter(r => r.status === 'absent').length,
      late: attendanceRecords.filter(r => r.status === 'late').length,
      overallRate: 0
    };

    if (attendanceStats.totalRecords > 0) {
      attendanceStats.overallRate = ((attendanceStats.present + attendanceStats.late) / attendanceStats.totalRecords) * 100;
    }

    // Grade statistics
    const gradesSnapshot = await db.collection('grades')
      .where('gradedAt', '>=', startDate)
      .where('gradedAt', '<=', endDate)
      .get();

    const grades = gradesSnapshot.docs.map(doc => doc.data());
    const gradeStats = {
      totalGrades: grades.length,
      averagePercentage: 0,
      distribution: {
        'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0
      }
    };

    if (grades.length > 0) {
      const totalPercentage = grades.reduce((sum, grade) => sum + grade.percentage, 0);
      gradeStats.averagePercentage = totalPercentage / grades.length;

      // Grade distribution
      grades.forEach(grade => {
        if (grade.percentage >= 90) gradeStats.distribution.A++;
        else if (grade.percentage >= 80) gradeStats.distribution.B++;
        else if (grade.percentage >= 70) gradeStats.distribution.C++;
        else if (grade.percentage >= 60) gradeStats.distribution.D++;
        else gradeStats.distribution.F++;
      });
    }

    // Recent activity
    const recentActivity = await getRecentActivity(startDate, endDate, 10);

    return {
      userStats,
      academicStats: {
        totalClasses: classesSnapshot.size,
        totalSubjects: subjectsSnapshot.size,
        totalEnrollments: enrollmentsSnapshot.size,
        activeAcademicYear: activeAcademicYear ? activeAcademicYear.data().name : 'None'
      },
      assignmentStats: {
        totalAssignments: assignmentsSnapshot.size
      },
      attendanceStats,
      gradeStats,
      recentActivity
    };
  } catch (error) {
    console.error('Error generating super admin analytics:', error);
    throw error;
  }
};

// Teacher Analytics
const generateTeacherAnalytics = async (teacherId, startDate, endDate) => {
  try {
    // Get teacher's classes
    const classesSnapshot = await db.collection('classes')
      .where('teacherId', '==', teacherId)
      .get();

    const classIds = classesSnapshot.docs.map(doc => doc.id);
    const classStats = {
      totalClasses: classIds.length,
      totalStudents: 0
    };

    // Get total students across all classes
    for (const classId of classIds) {
      const enrollmentsSnapshot = await db.collection('enrollments')
        .where('classId', '==', classId)
        .where('status', '==', 'active')
        .get();
      classStats.totalStudents += enrollmentsSnapshot.size;
    }

    // Assignment statistics
    const assignmentsSnapshot = await db.collection('assignments')
      .where('teacherId', '==', teacherId)
      .where('createdAt', '>=', startDate)
      .where('createdAt', '<=', endDate)
      .get();

    const assignmentStats = {
      totalAssignments: assignmentsSnapshot.size,
      pendingGrading: 0,
      averageScore: 0
    };

    // Get submissions and grading statistics
    let totalSubmissions = 0;
    let gradedSubmissions = 0;
    let totalScore = 0;

    for (const assignmentDoc of assignmentsSnapshot.docs) {
      const submissionsSnapshot = await db.collection('submissions')
        .where('assignmentId', '==', assignmentDoc.id)
        .get();

      totalSubmissions += submissionsSnapshot.size;
      
      submissionsSnapshot.docs.forEach(doc => {
        const submission = doc.data();
        if (submission.status === 'graded') {
          gradedSubmissions++;
          totalScore += submission.grade || 0;
        }
      });
    }

    assignmentStats.pendingGrading = totalSubmissions - gradedSubmissions;
    assignmentStats.averageScore = gradedSubmissions > 0 ? totalScore / gradedSubmissions : 0;

    // Attendance statistics for teacher's classes
    const attendanceStats = await getTeacherAttendanceStats(classIds, startDate, endDate);

    // Recent activity
    const recentActivity = await getTeacherRecentActivity(teacherId, startDate, endDate, 10);

    return {
      classStats,
      assignmentStats,
      attendanceStats,
      recentActivity
    };
  } catch (error) {
    console.error('Error generating teacher analytics:', error);
    throw error;
  }
};

// Student Analytics
const generateStudentAnalytics = async (studentId, startDate, endDate) => {
  try {
    // Get student's enrollments
    const enrollmentsSnapshot = await db.collection('enrollments')
      .where('studentId', '==', studentId)
      .where('status', '==', 'active')
      .get();

    const classIds = enrollmentsSnapshot.docs.map(doc => doc.data().classId);

    // Grade statistics
    const gradesSnapshot = await db.collection('grades')
      .where('studentId', '==', studentId)
      .where('gradedAt', '>=', startDate)
      .where('gradedAt', '<=', endDate)
      .get();

    const grades = gradesSnapshot.docs.map(doc => doc.data());
    const gradeStats = {
      totalGrades: grades.length,
      averagePercentage: 0,
      highestScore: 0,
      lowestScore: 100,
      improvement: 0
    };

    if (grades.length > 0) {
      const totalPercentage = grades.reduce((sum, grade) => sum + grade.percentage, 0);
      gradeStats.averagePercentage = totalPercentage / grades.length;
      gradeStats.highestScore = Math.max(...grades.map(g => g.percentage));
      gradeStats.lowestScore = Math.min(...grades.map(g => g.percentage));

      // Calculate improvement (compare first half vs second half)
      const midPoint = Math.floor(grades.length / 2);
      if (grades.length >= 4) {
        const firstHalf = grades.slice(0, midPoint);
        const secondHalf = grades.slice(midPoint);
        const firstAvg = firstHalf.reduce((sum, g) => sum + g.percentage, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, g) => sum + g.percentage, 0) / secondHalf.length;
        gradeStats.improvement = secondAvg - firstAvg;
      }
    }

    // Attendance statistics
    const attendanceStats = await getStudentAttendanceStats(studentId, classIds, startDate, endDate);

    // Assignment statistics
    const assignmentStats = await getStudentAssignmentStats(studentId, classIds, startDate, endDate);

    // Subject performance
    const subjectPerformance = await getStudentSubjectPerformance(studentId, startDate, endDate);

    return {
      enrollmentStats: {
        totalClasses: classIds.length
      },
      gradeStats,
      attendanceStats,
      assignmentStats,
      subjectPerformance
    };
  } catch (error) {
    console.error('Error generating student analytics:', error);
    throw error;
  }
};

// Helper functions
const getRecentActivity = async (startDate, endDate, limit) => {
  try {
    const activities = [];

    // Get recent user creations
    const usersSnapshot = await db.collection('users')
      .where('createdAt', '>=', startDate)
      .where('createdAt', '<=', endDate)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    usersSnapshot.docs.forEach(doc => {
      const user = doc.data();
      activities.push({
        type: 'user_created',
        description: `New ${user.role} account created: ${user.firstName} ${user.lastName}`,
        timestamp: user.createdAt,
        userId: doc.id
      });
    });

    // Get recent assignments
    const assignmentsSnapshot = await db.collection('assignments')
      .where('createdAt', '>=', startDate)
      .where('createdAt', '<=', endDate)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    assignmentsSnapshot.docs.forEach(doc => {
      const assignment = doc.data();
      activities.push({
        type: 'assignment_created',
        description: `New assignment created: ${assignment.title}`,
        timestamp: assignment.createdAt,
        assignmentId: doc.id
      });
    });

    // Sort by timestamp and return top activities
    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting recent activity:', error);
    return [];
  }
};

const getTeacherAttendanceStats = async (classIds, startDate, endDate) => {
  try {
    const stats = {
      totalRecords: 0,
      present: 0,
      absent: 0,
      late: 0,
      overallRate: 0
    };

    for (const classId of classIds) {
      const attendanceSnapshot = await db.collection('attendance')
        .where('classId', '==', classId)
        .where('date', '>=', startDate.toISOString().split('T')[0])
        .where('date', '<=', endDate.toISOString().split('T')[0])
        .get();

      attendanceSnapshot.docs.forEach(doc => {
        const record = doc.data();
        stats.totalRecords++;
        stats[record.status]++;
      });
    }

    if (stats.totalRecords > 0) {
      stats.overallRate = ((stats.present + stats.late) / stats.totalRecords) * 100;
    }

    return stats;
  } catch (error) {
    console.error('Error getting teacher attendance stats:', error);
    return {};
  }
};

const getStudentAttendanceStats = async (studentId, classIds, startDate, endDate) => {
  try {
    const attendanceSnapshot = await db.collection('attendance')
      .where('studentId', '==', studentId)
      .where('date', '>=', startDate.toISOString().split('T')[0])
      .where('date', '<=', endDate.toISOString().split('T')[0])
      .get();

    const stats = {
      totalDays: attendanceSnapshot.size,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      attendanceRate: 0
    };

    attendanceSnapshot.docs.forEach(doc => {
      const record = doc.data();
      stats[record.status]++;
    });

    if (stats.totalDays > 0) {
      stats.attendanceRate = ((stats.present + stats.late) / stats.totalDays) * 100;
    }

    return stats;
  } catch (error) {
    console.error('Error getting student attendance stats:', error);
    return {};
  }
};

const getStudentAssignmentStats = async (studentId, classIds, startDate, endDate) => {
  try {
    const stats = {
      totalAssignments: 0,
      submitted: 0,
      pending: 0,
      graded: 0,
      onTime: 0,
      late: 0
    };

    for (const classId of classIds) {
      const assignmentsSnapshot = await db.collection('assignments')
        .where('classId', '==', classId)
        .where('createdAt', '>=', startDate)
        .where('createdAt', '<=', endDate)
        .get();

      for (const assignmentDoc of assignmentsSnapshot.docs) {
        stats.totalAssignments++;

        const submissionSnapshot = await db.collection('submissions')
          .where('assignmentId', '==', assignmentDoc.id)
          .where('studentId', '==', studentId)
          .get();

        if (!submissionSnapshot.empty) {
          const submission = submissionSnapshot.docs[0].data();
          stats.submitted++;
          
          if (submission.status === 'graded') {
            stats.graded++;
          }
          
          if (submission.isLate) {
            stats.late++;
          } else {
            stats.onTime++;
          }
        } else {
          stats.pending++;
        }
      }
    }

    return stats;
  } catch (error) {
    console.error('Error getting student assignment stats:', error);
    return {};
  }
};

const getStudentSubjectPerformance = async (studentId, startDate, endDate) => {
  try {
    const gradesSnapshot = await db.collection('grades')
      .where('studentId', '==', studentId)
      .where('gradedAt', '>=', startDate)
      .where('gradedAt', '<=', endDate)
      .get();

    const subjectPerformance = {};

    for (const gradeDoc of gradesSnapshot.docs) {
      const grade = gradeDoc.data();
      
      if (!subjectPerformance[grade.subjectId]) {
        // Get subject name
        const subjectDoc = await db.collection('subjects').doc(grade.subjectId).get();
        const subjectName = subjectDoc.exists ? subjectDoc.data().name : 'Unknown Subject';
        
        subjectPerformance[grade.subjectId] = {
          subjectName,
          grades: [],
          averagePercentage: 0,
          totalGrades: 0
        };
      }

      subjectPerformance[grade.subjectId].grades.push(grade.percentage);
      subjectPerformance[grade.subjectId].totalGrades++;
    }

    // Calculate averages
    Object.values(subjectPerformance).forEach(subject => {
      if (subject.grades.length > 0) {
        subject.averagePercentage = subject.grades.reduce((sum, grade) => sum + grade, 0) / subject.grades.length;
      }
    });

    return Object.values(subjectPerformance);
  } catch (error) {
    console.error('Error getting student subject performance:', error);
    return [];
  }
};

const getTeacherRecentActivity = async (teacherId, startDate, endDate, limit) => {
  try {
    const activities = [];

    // Get recent assignments created
    const assignmentsSnapshot = await db.collection('assignments')
      .where('teacherId', '==', teacherId)
      .where('createdAt', '>=', startDate)
      .where('createdAt', '<=', endDate)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    assignmentsSnapshot.docs.forEach(doc => {
      const assignment = doc.data();
      activities.push({
        type: 'assignment_created',
        description: `Created assignment: ${assignment.title}`,
        timestamp: assignment.createdAt
      });
    });

    // Get recent grades given
    const gradesSnapshot = await db.collection('grades')
      .where('teacherId', '==', teacherId)
      .where('gradedAt', '>=', startDate)
      .where('gradedAt', '<=', endDate)
      .orderBy('gradedAt', 'desc')
      .limit(limit)
      .get();

    gradesSnapshot.docs.forEach(doc => {
      const grade = doc.data();
      activities.push({
        type: 'grade_given',
        description: `Graded assignment: ${grade.score}/${grade.maxScore}`,
        timestamp: grade.gradedAt
      });
    });

    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting teacher recent activity:', error);
    return [];
  }
};

module.exports = {
  generateDashboardAnalytics
};
