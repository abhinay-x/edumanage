const admin = require('firebase-admin');
const { validateClassData } = require('../utils/validationHelpers');

const db = admin.firestore();

// Academic Year Management
const createAcademicYear = async (yearData, creatorUid) => {
  try {
    const academicYearDoc = {
      name: yearData.name,
      startDate: yearData.startDate,
      endDate: yearData.endDate,
      isActive: yearData.isActive || false,
      terms: yearData.terms || [],
      description: yearData.description || '',
      createdBy: creatorUid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('academicYears').add(academicYearDoc);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating academic year:', error);
    throw error;
  }
};

const setActiveAcademicYear = async (yearId, updaterUid) => {
  try {
    const batch = db.batch();

    // Set all academic years to inactive
    const yearsSnapshot = await db.collection('academicYears').get();
    yearsSnapshot.docs.forEach(doc => {
      batch.update(doc.ref, { isActive: false });
    });

    // Set the selected year as active
    const yearRef = db.collection('academicYears').doc(yearId);
    batch.update(yearRef, { 
      isActive: true,
      updatedBy: updaterUid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('Error setting active academic year:', error);
    throw error;
  }
};

// Subject Management
const createSubject = async (subjectData, creatorUid) => {
  try {
    const subjectDoc = {
      name: subjectData.name,
      code: subjectData.code,
      description: subjectData.description || '',
      credits: subjectData.credits || 0,
      type: subjectData.type || 'core', // core, elective, lab
      department: subjectData.department || '',
      prerequisites: subjectData.prerequisites || [],
      isActive: true,
      createdBy: creatorUid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('subjects').add(subjectDoc);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating subject:', error);
    throw error;
  }
};

// Class Management
const createClass = async (classData, creatorUid) => {
  try {
    const validation = validateClassData(classData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const classDoc = {
      name: classData.name,
      grade: classData.grade,
      section: classData.section || 'A',
      capacity: classData.capacity || 30,
      room: classData.room || '',
      teacherId: classData.teacherId || null,
      subjectIds: classData.subjectIds || [],
      academicYearId: classData.academicYearId,
      schedule: classData.schedule || [],
      isActive: true,
      createdBy: creatorUid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('classes').add(classDoc);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating class:', error);
    throw error;
  }
};

// Enrollment Management
const enrollStudentInClass = async (enrollmentData, enrollerUid) => {
  try {
    const { studentId, classId, academicYearId } = enrollmentData;

    // Check if student is already enrolled
    const existingEnrollment = await db.collection('enrollments')
      .where('studentId', '==', studentId)
      .where('classId', '==', classId)
      .where('academicYearId', '==', academicYearId)
      .get();

    if (!existingEnrollment.empty) {
      throw new Error('Student is already enrolled in this class');
    }

    // Check class capacity
    const classDoc = await db.collection('classes').doc(classId).get();
    if (!classDoc.exists) {
      throw new Error('Class not found');
    }

    const classData = classDoc.data();
    const currentEnrollments = await db.collection('enrollments')
      .where('classId', '==', classId)
      .where('status', '==', 'active')
      .get();

    if (currentEnrollments.size >= classData.capacity) {
      throw new Error('Class is at full capacity');
    }

    // Create enrollment
    const enrollmentDoc = {
      studentId,
      classId,
      academicYearId,
      enrollmentDate: admin.firestore.FieldValue.serverTimestamp(),
      status: 'active',
      enrolledBy: enrollerUid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('enrollments').add(enrollmentDoc);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error enrolling student:', error);
    throw error;
  }
};

const unenrollStudentFromClass = async (enrollmentId, unenrollerUid) => {
  try {
    await db.collection('enrollments').doc(enrollmentId).update({
      status: 'inactive',
      unenrollmentDate: admin.firestore.FieldValue.serverTimestamp(),
      unenrolledBy: unenrollerUid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error unenrolling student:', error);
    throw error;
  }
};

// Timetable Management
const createTimetable = async (timetableData, creatorUid) => {
  try {
    const timetableDoc = {
      name: timetableData.name,
      academicYearId: timetableData.academicYearId,
      classId: timetableData.classId,
      schedule: timetableData.schedule, // Array of time slots
      effectiveDate: timetableData.effectiveDate,
      isActive: true,
      createdBy: creatorUid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('timetables').add(timetableDoc);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating timetable:', error);
    throw error;
  }
};

// Get class statistics
const getClassStatistics = async (classId) => {
  try {
    // Get enrollments
    const enrollmentsSnapshot = await db.collection('enrollments')
      .where('classId', '==', classId)
      .where('status', '==', 'active')
      .get();

    const totalStudents = enrollmentsSnapshot.size;

    // Get recent attendance
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const attendanceSnapshot = await db.collection('attendance')
      .where('classId', '==', classId)
      .where('date', '>=', thirtyDaysAgo.toISOString().split('T')[0])
      .get();

    let totalAttendanceRecords = 0;
    let presentCount = 0;

    attendanceSnapshot.docs.forEach(doc => {
      const data = doc.data();
      totalAttendanceRecords++;
      if (data.status === 'present' || data.status === 'late') {
        presentCount++;
      }
    });

    const attendanceRate = totalAttendanceRecords > 0 
      ? (presentCount / totalAttendanceRecords) * 100 
      : 0;

    // Get assignments count
    const assignmentsSnapshot = await db.collection('assignments')
      .where('classId', '==', classId)
      .where('status', '==', 'active')
      .get();

    return {
      totalStudents,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
      totalAssignments: assignmentsSnapshot.size,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting class statistics:', error);
    throw error;
  }
};

module.exports = {
  createAcademicYear,
  setActiveAcademicYear,
  createSubject,
  createClass,
  enrollStudentInClass,
  unenrollStudentFromClass,
  createTimetable,
  getClassStatistics
};
