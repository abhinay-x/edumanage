const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function createUserDocs() {
  try {
    console.log('Creating Firestore user documents...');

    // Create Sample Super Admin
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
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create Sample Teacher
    const teacherUser = await admin.auth().createUser({
      email: 'teacher@gmail.com',
      password: 'teacher@123',
      displayName: 'John Teacher'
    });

    await db.collection('users').doc(teacherUser.uid).set({
      uid: teacherUser.uid,
      email: 'teacher@gmail.com',
      firstName: 'John',
      lastName: 'teacher',
      role: 'teacher',
      employeeId: 'T001',
      department: 'cse',
      subjects: ['Mathematics', 'Physics'],
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create Sample Student
    const studentUser = await admin.auth().createUser({
      email: 'student@gmail.com',
      password: 'Student@123',
      displayName: 'Jane Student'
    });

    await db.collection('users').doc(studentUser.uid).set({
      uid: studentUser.uid,
      email: 'student@gmail.com',
      firstName: 'pranay',
      lastName: 'kumar',
      role: 'student',
      studentId: 'S001',
      grade: 'btech',
      section: 'B',
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create Academic Year
    await db.collection('academicYears').add({
      name: '2024-2025',
      startDate: '2024-04-01',
      endDate: '2025-03-31',
      isActive: true,
      terms: [
        { name: 'Term 1', startDate: '2024-04-01', endDate: '2024-09-30' },
        { name: 'Term 2', startDate: '2024-10-01', endDate: '2025-03-31' }
      ],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create Subjects
    const mathSubject = await db.collection('subjects').add({
      name: 'Mathematics',
      code: 'MATH101',
      description: 'Basic Mathematics',
      credits: 4,
      type: 'core',
      department: 'Mathematics',
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create Class
    await db.collection('classes').add({
      name: 'Grade 10-A',
      grade: 10,
      section: 'A',
      capacity: 30,
      room: 'Room 101',
      teacherId: teacherUser.uid,
      subjectIds: [mathSubject.id],
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ Created user document for admin@gmail.com with role: super_admin`);
    console.log(`✅ Created user document for teacher@gmail.com with role: teacher`);
    console.log(`✅ Created user document for student@gmail.com with role: student`);

    console.log('\n🎉 All user documents created successfully!');
    console.log('\n🔐 Login Credentials:');
    console.log('• admin@gmail.com → super_admin dashboard');
    console.log('• teacher@gmail.com → teacher dashboard');
    console.log('• student@gmail.com → student dashboard');

  } catch (error) {
    console.error('❌ Error creating user documents:', error);
  }
}

// Run the function
createUserDocs().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Failed:', error);
  process.exit(1);
});
