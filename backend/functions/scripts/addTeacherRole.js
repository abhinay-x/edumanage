const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function addTeacherRole() {
  try {
    console.log('Adding teacher role to existing user...');

    // Get the teacher user from Firebase Auth by email
    const teacherEmail = 'teacher@gmail.com'; // Update this to match your teacher's email
    
    try {
      const userRecord = await admin.auth().getUserByEmail(teacherEmail);
      console.log('Found teacher user:', userRecord.uid);

      // Create/update the user document in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: teacherEmail,
        firstName: 'Teacher',
        lastName: 'User',
        role: 'teacher',
        department: 'Mathematics',
        subjects: ['Mathematics', 'Physics'],
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true }); // merge: true will update existing document or create new one

      console.log('✅ Successfully added teacher role to user:', teacherEmail);
      console.log('🎉 Teacher can now login and access dashboard!');

    } catch (authError) {
      console.log('Teacher user not found in Firebase Auth. Creating new user...');
      
      // Create the user in Firebase Auth first
      const newUser = await admin.auth().createUser({
        email: teacherEmail,
        password: 'Teacher@123',
        displayName: 'Teacher User'
      });

      console.log('Created new teacher user:', newUser.uid);

      // Create the user document in Firestore
      await db.collection('users').doc(newUser.uid).set({
        uid: newUser.uid,
        email: teacherEmail,
        firstName: 'Teacher',
        lastName: 'User',
        role: 'teacher',
        department: 'Mathematics',
        subjects: ['Mathematics', 'Physics'],
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log('✅ Successfully created teacher user with role!');
      console.log('🔐 Login credentials: teacher@gmail.com / Teacher@123');
    }

  } catch (error) {
    console.error('❌ Error adding teacher role:', error);
  }
}

// Run the function
addTeacherRole().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Failed:', error);
  process.exit(1);
});
