const admin = require('firebase-admin');

// Initialize Firebase Admin
// You need to download serviceAccountKey.json from Firebase Console
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initializeData() {
  try {
    console.log('Starting data initialization...');

    // Create Super Admin User
    console.log('Creating Super Admin...');
    const superAdminUser = await admin.auth().createUser({
      email: 'admin@gmail.com',
      password: 'Admin@123',
      displayName: 'Super Admin'
    });

    await db.collection('users').doc(superAdminUser.uid).set({
      uid: superAdminUser.uid,
      email: 'admin@gmail.com',
      firstName: 'Super',
      lastName: 'Admin',
      role: 'super_admin',
      employeeId: 'SA001',
      phoneNumber: '+1234567890',
      address: '123 Admin Street',
      isActive: true,
      permissions: ['all'],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create Sample Teacher
    console.log('Creating Sample Teacher...');
    const teacherUser = await admin.auth().createUser({
      email: 'teacher@edumanage.com',
      password: 'Teacher@123',
      displayName: 'John Teacher'
    });

    await db.collection('users').doc(teacherUser.uid).set({
      uid: teacherUser.uid,
      email: 'teacher@edumanage.com',
      firstName: 'John',
      lastName: 'Teacher',
      role: 'teacher',
      employeeId: 'T001',
      phoneNumber: '+1234567891',
      address: '456 Teacher Lane',
      department: 'Mathematics',
      subjects: ['Mathematics', 'Physics'],
      qualifications: ['M.Sc Mathematics', 'B.Ed'],
      experience: 5,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create Sample Student
    console.log('Creating Sample Student...');
    const studentUser = await admin.auth().createUser({
      email: 'student@edumanage.com',
      password: 'Student@123',
      displayName: 'Jane Student'
    });

    await db.collection('users').doc(studentUser.uid).set({
      uid: studentUser.uid,
      email: 'student@edumanage.com',
      firstName: 'Jane',
      lastName: 'Student',
      role: 'student',
      studentId: 'S001',
      phoneNumber: '+1234567892',
      address: '789 Student Ave',
      grade: 10,
      section: 'A',
      parentEmail: 'parent@edumanage.com',
      parentPhone: '+1234567893',
      dateOfBirth: '2008-05-15',
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create Academic Year
    console.log('Creating Academic Year...');
    const academicYearRef = await db.collection('academicYears').add({
      name: '2024-2025',
      startDate: '2024-04-01',
      endDate: '2025-03-31',
      isActive: true,
      description: 'Academic Year 2024-2025',
      terms: [
        { 
          name: 'Term 1', 
          startDate: '2024-04-01', 
          endDate: '2024-09-30',
          description: 'First Term'
        },
        { 
          name: 'Term 2', 
          startDate: '2024-10-01', 
          endDate: '2025-03-31',
          description: 'Second Term'
        }
      ],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create Subjects
    console.log('Creating Subjects...');
    const mathSubject = await db.collection('subjects').add({
      name: 'Mathematics',
      code: 'MATH101',
      description: 'Basic Mathematics for Grade 10',
      credits: 4,
      type: 'core',
      department: 'Mathematics',
      prerequisites: [],
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const physicsSubject = await db.collection('subjects').add({
      name: 'Physics',
      code: 'PHY101',
      description: 'Basic Physics for Grade 10',
      credits: 4,
      type: 'core',
      department: 'Science',
      prerequisites: [],
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create Class
    console.log('Creating Class...');
    const classRef = await db.collection('classes').add({
      name: 'Grade 10-A',
      grade: 10,
      section: 'A',
      capacity: 30,
      room: 'Room 101',
      teacherId: teacherUser.uid,
      subjectIds: [mathSubject.id, physicsSubject.id],
      academicYearId: academicYearRef.id,
      schedule: [
        {
          day: 'Monday',
          periods: [
            { subject: 'Mathematics', time: '09:00-10:00', room: 'Room 101' },
            { subject: 'Physics', time: '10:00-11:00', room: 'Room 101' }
          ]
        }
      ],
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Enroll Student in Class
    console.log('Enrolling Student in Class...');
    await db.collection('enrollments').add({
      studentId: studentUser.uid,
      classId: classRef.id,
      academicYearId: academicYearRef.id,
      enrollmentDate: admin.firestore.FieldValue.serverTimestamp(),
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create Sample Assignment
    console.log('Creating Sample Assignment...');
    const assignmentRef = await db.collection('assignments').add({
      title: 'Algebra Basics',
      description: 'Complete exercises 1-10 from Chapter 2',
      instructions: 'Show all working steps and submit handwritten solutions',
      classId: classRef.id,
      subjectId: mathSubject.id,
      teacherId: teacherUser.uid,
      dueDate: '2024-12-31',
      maxScore: 100,
      attachments: [],
      submissionType: 'file',
      allowLateSubmission: true,
      latePenalty: 10,
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create Sample Attendance
    console.log('Creating Sample Attendance...');
    const today = new Date().toISOString().split('T')[0];
    await db.collection('attendance').doc(`${classRef.id}_${studentUser.uid}_${today}`).set({
      classId: classRef.id,
      studentId: studentUser.uid,
      date: today,
      status: 'present',
      notes: 'On time',
      markedBy: teacherUser.uid,
      markedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create Sample Grade
    console.log('Creating Sample Grade...');
    await db.collection('grades').add({
      studentId: studentUser.uid,
      assignmentId: assignmentRef.id,
      classId: classRef.id,
      subjectId: mathSubject.id,
      teacherId: teacherUser.uid,
      score: 85,
      maxScore: 100,
      percentage: 85,
      feedback: 'Good work! Keep practicing algebra problems.',
      gradedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create Sample Announcement
    console.log('Creating Sample Announcement...');
    await db.collection('announcements').add({
      title: 'Welcome to EduManage System',
      content: 'Welcome to the new academic year! Please check your schedules and assignments regularly.',
      targetAudience: 'all',
      classIds: [],
      priority: 'normal',
      expiryDate: '2025-03-31',
      createdBy: superAdminUser.uid,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('\n✅ Sample data initialized successfully!');
    console.log('\n🔐 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 Super Admin: admin@gmail.com / Admin@123');
    console.log('👨‍🏫 Teacher:     teacher@edumanage.com / Teacher@123');
    console.log('👨‍🎓 Student:     student@edumanage.com / Student@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📊 Data Created:');
    console.log('• 3 Users (Super Admin, Teacher, Student)');
    console.log('• 1 Academic Year (2024-2025)');
    console.log('• 2 Subjects (Mathematics, Physics)');
    console.log('• 1 Class (Grade 10-A)');
    console.log('• 1 Enrollment');
    console.log('• 1 Assignment');
    console.log('• 1 Attendance Record');
    console.log('• 1 Grade Record');
    console.log('• 1 Announcement');
    console.log('\n🚀 Your EduManage system is ready to use!');
    
  } catch (error) {
    console.error('❌ Error initializing data:', error);
    if (error.code === 'auth/email-already-exists') {
      console.log('\n⚠️  Some users already exist. This is normal if you\'ve run this script before.');
      console.log('You can still use the existing credentials to log in.');
    }
  }
}

// Run the initialization
initializeData().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Failed to initialize data:', error);
  process.exit(1);
});
