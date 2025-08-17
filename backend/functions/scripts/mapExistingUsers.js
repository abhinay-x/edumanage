const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function mapExistingUsers() {
  try {
    console.log('Starting to map existing Firebase Auth users to Firestore...');

    // Get all users from Firebase Auth
    const listUsersResult = await admin.auth().listUsers();
    
    for (const userRecord of listUsersResult.users) {
      const email = userRecord.email;
      const uid = userRecord.uid;
      
      // Determine role based on email or displayName
      let role = 'student'; // default
      if (email && email.includes('admin')) {
        role = 'super_admin';
      } else if (email && email.includes('teacher')) {
        role = 'teacher';
      }
      
      // Check if user document already exists in Firestore
      const userDoc = await db.collection('users').doc(uid).get();
      
      if (!userDoc.exists) {
        // Create user document in Firestore
        await db.collection('users').doc(uid).set({
          uid: uid,
          email: email,
          firstName: userRecord.displayName ? userRecord.displayName.split(' ')[0] : 'User',
          lastName: userRecord.displayName ? userRecord.displayName.split(' ')[1] || '' : '',
          role: role,
          isActive: true,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        console.log(`✅ Created Firestore document for ${email} with role: ${role}`);
      } else {
        // Update existing document with role if missing
        const userData = userDoc.data();
        if (!userData.role) {
          await db.collection('users').doc(uid).update({
            role: role,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          console.log(`✅ Updated role for ${email} to: ${role}`);
        } else {
          console.log(`ℹ️  User ${email} already has role: ${userData.role}`);
        }
      }
    }
    
    console.log('\n🎉 Successfully mapped all existing users!');
    console.log('\n📋 User Roles:');
    console.log('• admin@gmail.com → super_admin');
    console.log('• teacher@gmail.com → teacher');  
    console.log('• student@gmail.com → student');
    console.log('\nYou can now log in with these accounts and see the appropriate dashboards.');
    
  } catch (error) {
    console.error('❌ Error mapping users:', error);
  }
}

// Run the mapping
mapExistingUsers().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Failed to map users:', error);
  process.exit(1);
});
