const admin = require('firebase-admin');
const moment = require('moment');

const db = admin.firestore();

// Generate attendance report
const generateAttendanceReport = async (classId, startDate, endDate) => {
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

    const students = {};
    const attendanceData = {};

    // Get student information
    for (const enrollment of enrollmentsSnapshot.docs) {
      const studentId = enrollment.data().studentId;
      const studentDoc = await db.collection('users').doc(studentId).get();
      if (studentDoc.exists) {
        students[studentId] = studentDoc.data();
        attendanceData[studentId] = {
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
          total: 0
        };
      }
    }

    // Process attendance records
    attendanceSnapshot.docs.forEach(doc => {
      const record = doc.data();
      if (attendanceData[record.studentId]) {
        attendanceData[record.studentId][record.status]++;
        attendanceData[record.studentId].total++;
      }
    });

    // Calculate attendance rates
    const report = Object.keys(students).map(studentId => {
      const student = students[studentId];
      const attendance = attendanceData[studentId];
      const attendanceRate = attendance.total > 0 
        ? ((attendance.present + attendance.late) / attendance.total) * 100 
        : 0;

      return {
        studentId,
        studentName: `${student.firstName} ${student.lastName}`,
        email: student.email,
        present: attendance.present,
        absent: attendance.absent,
        late: attendance.late,
        excused: attendance.excused,
        total: attendance.total,
        attendanceRate: Math.round(attendanceRate * 100) / 100
      };
    });

    return {
      classId,
      startDate,
      endDate,
      totalStudents: Object.keys(students).length,
      students: report,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating attendance report:', error);
    throw error;
  }
};

// Generate grade report
const generateGradeReport = async (classId, subjectId, academicYearId) => {
  try {
    const gradesSnapshot = await db.collection('grades')
      .where('classId', '==', classId)
      .where('subjectId', '==', subjectId)
      .where('academicYearId', '==', academicYearId)
      .get();

    const enrollmentsSnapshot = await db.collection('enrollments')
      .where('classId', '==', classId)
      .where('academicYearId', '==', academicYearId)
      .where('status', '==', 'active')
      .get();

    const students = {};
    const gradeData = {};

    // Get student information
    for (const enrollment of enrollmentsSnapshot.docs) {
      const studentId = enrollment.data().studentId;
      const studentDoc = await db.collection('users').doc(studentId).get();
      if (studentDoc.exists) {
        students[studentId] = studentDoc.data();
        gradeData[studentId] = [];
      }
    }

    // Process grade records
    gradesSnapshot.docs.forEach(doc => {
      const grade = doc.data();
      if (gradeData[grade.studentId]) {
        gradeData[grade.studentId].push(grade);
      }
    });

    // Calculate statistics
    const report = Object.keys(students).map(studentId => {
      const student = students[studentId];
      const grades = gradeData[studentId];
      
      let totalScore = 0;
      let totalMaxScore = 0;
      let assignmentCount = grades.length;

      grades.forEach(grade => {
        totalScore += grade.score;
        totalMaxScore += grade.maxScore;
      });

      const averagePercentage = totalMaxScore > 0 
        ? (totalScore / totalMaxScore) * 100 
        : 0;

      return {
        studentId,
        studentName: `${student.firstName} ${student.lastName}`,
        email: student.email,
        assignmentCount,
        totalScore,
        totalMaxScore,
        averagePercentage: Math.round(averagePercentage * 100) / 100,
        grades: grades.map(g => ({
          assignmentTitle: g.assignmentTitle,
          score: g.score,
          maxScore: g.maxScore,
          percentage: Math.round((g.score / g.maxScore) * 100 * 100) / 100,
          submittedAt: g.submittedAt,
          gradedAt: g.gradedAt
        }))
      };
    });

    // Calculate class statistics
    const classStats = {
      totalStudents: report.length,
      averageClassPercentage: report.length > 0 
        ? report.reduce((sum, student) => sum + student.averagePercentage, 0) / report.length 
        : 0,
      highestPercentage: report.length > 0 
        ? Math.max(...report.map(s => s.averagePercentage)) 
        : 0,
      lowestPercentage: report.length > 0 
        ? Math.min(...report.map(s => s.averagePercentage)) 
        : 0
    };

    return {
      classId,
      subjectId,
      academicYearId,
      classStats,
      students: report,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating grade report:', error);
    throw error;
  }
};

// Generate student progress report
const generateStudentProgressReport = async (studentId, academicYearId) => {
  try {
    const studentDoc = await db.collection('users').doc(studentId).get();
    if (!studentDoc.exists) {
      throw new Error('Student not found');
    }

    const student = studentDoc.data();

    // Get enrollments
    const enrollmentsSnapshot = await db.collection('enrollments')
      .where('studentId', '==', studentId)
      .where('academicYearId', '==', academicYearId)
      .get();

    const progressData = [];

    for (const enrollmentDoc of enrollmentsSnapshot.docs) {
      const enrollment = enrollmentDoc.data();
      const classId = enrollment.classId;

      // Get class information
      const classDoc = await db.collection('classes').doc(classId).get();
      const classData = classDoc.exists ? classDoc.data() : {};

      // Get grades for this class
      const gradesSnapshot = await db.collection('grades')
        .where('studentId', '==', studentId)
        .where('classId', '==', classId)
        .where('academicYearId', '==', academicYearId)
        .get();

      // Get attendance for this class
      const attendanceSnapshot = await db.collection('attendance')
        .where('studentId', '==', studentId)
        .where('classId', '==', classId)
        .get();

      // Calculate grade statistics
      let totalScore = 0;
      let totalMaxScore = 0;
      const grades = gradesSnapshot.docs.map(doc => doc.data());

      grades.forEach(grade => {
        totalScore += grade.score;
        totalMaxScore += grade.maxScore;
      });

      const averagePercentage = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;

      // Calculate attendance statistics
      const attendanceRecords = attendanceSnapshot.docs.map(doc => doc.data());
      const attendanceStats = {
        present: attendanceRecords.filter(r => r.status === 'present').length,
        absent: attendanceRecords.filter(r => r.status === 'absent').length,
        late: attendanceRecords.filter(r => r.status === 'late').length,
        total: attendanceRecords.length
      };

      const attendanceRate = attendanceStats.total > 0 
        ? ((attendanceStats.present + attendanceStats.late) / attendanceStats.total) * 100 
        : 0;

      progressData.push({
        classId,
        className: classData.name || 'Unknown Class',
        grade: classData.grade || 'N/A',
        section: classData.section || 'N/A',
        averagePercentage: Math.round(averagePercentage * 100) / 100,
        attendanceRate: Math.round(attendanceRate * 100) / 100,
        assignmentCount: grades.length,
        attendanceStats,
        recentGrades: grades.slice(-5).map(g => ({
          assignmentTitle: g.assignmentTitle,
          score: g.score,
          maxScore: g.maxScore,
          percentage: Math.round((g.score / g.maxScore) * 100 * 100) / 100,
          gradedAt: g.gradedAt
        }))
      });
    }

    // Calculate overall statistics
    const overallStats = {
      totalClasses: progressData.length,
      overallGradeAverage: progressData.length > 0 
        ? progressData.reduce((sum, cls) => sum + cls.averagePercentage, 0) / progressData.length 
        : 0,
      overallAttendanceRate: progressData.length > 0 
        ? progressData.reduce((sum, cls) => sum + cls.attendanceRate, 0) / progressData.length 
        : 0
    };

    return {
      student: {
        id: studentId,
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        studentId: student.studentId
      },
      academicYearId,
      overallStats,
      classProgress: progressData,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating student progress report:', error);
    throw error;
  }
};

// Generate teacher performance report
const generateTeacherPerformanceReport = async (teacherId, academicYearId) => {
  try {
    const teacherDoc = await db.collection('users').doc(teacherId).get();
    if (!teacherDoc.exists) {
      throw new Error('Teacher not found');
    }

    const teacher = teacherDoc.data();

    // Get classes taught by this teacher
    const classesSnapshot = await db.collection('classes')
      .where('teacherId', '==', teacherId)
      .where('academicYearId', '==', academicYearId)
      .get();

    const performanceData = [];

    for (const classDoc of classesSnapshot.docs) {
      const classData = classDoc.data();
      const classId = classDoc.id;

      // Get enrollments for this class
      const enrollmentsSnapshot = await db.collection('enrollments')
        .where('classId', '==', classId)
        .where('status', '==', 'active')
        .get();

      const studentCount = enrollmentsSnapshot.size;

      // Get assignments created by this teacher for this class
      const assignmentsSnapshot = await db.collection('assignments')
        .where('teacherId', '==', teacherId)
        .where('classId', '==', classId)
        .get();

      // Get grades given by this teacher for this class
      const gradesSnapshot = await db.collection('grades')
        .where('teacherId', '==', teacherId)
        .where('classId', '==', classId)
        .get();

      // Calculate average grade
      const grades = gradesSnapshot.docs.map(doc => doc.data());
      let totalScore = 0;
      let totalMaxScore = 0;

      grades.forEach(grade => {
        totalScore += grade.score;
        totalMaxScore += grade.maxScore;
      });

      const averageClassPercentage = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;

      performanceData.push({
        classId,
        className: classData.name,
        grade: classData.grade,
        section: classData.section,
        studentCount,
        assignmentCount: assignmentsSnapshot.size,
        gradesGiven: gradesSnapshot.size,
        averageClassPercentage: Math.round(averageClassPercentage * 100) / 100
      });
    }

    // Calculate overall statistics
    const overallStats = {
      totalClasses: performanceData.length,
      totalStudents: performanceData.reduce((sum, cls) => sum + cls.studentCount, 0),
      totalAssignments: performanceData.reduce((sum, cls) => sum + cls.assignmentCount, 0),
      totalGradesGiven: performanceData.reduce((sum, cls) => sum + cls.gradesGiven, 0),
      averageClassPerformance: performanceData.length > 0 
        ? performanceData.reduce((sum, cls) => sum + cls.averageClassPercentage, 0) / performanceData.length 
        : 0
    };

    return {
      teacher: {
        id: teacherId,
        name: `${teacher.firstName} ${teacher.lastName}`,
        email: teacher.email,
        employeeId: teacher.employeeId
      },
      academicYearId,
      overallStats,
      classPerformance: performanceData,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating teacher performance report:', error);
    throw error;
  }
};

module.exports = {
  generateAttendanceReport,
  generateGradeReport,
  generateStudentProgressReport,
  generateTeacherPerformanceReport
};
