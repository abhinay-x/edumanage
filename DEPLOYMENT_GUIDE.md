# EduManage Deployment Guide

## 🚀 Complete Setup and Deployment Guide

### Prerequisites
- Node.js 18+ installed
- Firebase CLI installed globally
- Vercel CLI installed globally
- Git repository

```bash
npm install -g firebase-tools
npm install -g vercel
```

## 📋 Step 1: Firebase Console Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `edumanage-system`
4. Enable Google Analytics (optional)
5. Select analytics account
6. Click "Create project"

### 1.2 Enable Firebase Services

#### Authentication Setup
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Click **Save**

#### Firestore Database Setup
1. Go to **Firestore Database**
2. Click **Create database**
3. Select **Start in test mode** (we'll update rules later)
4. Choose location (closest to your users)
5. Click **Done**

#### Storage Setup
1. Go to **Storage**
2. Click **Get started**
3. Select **Start in test mode**
4. Choose location
5. Click **Done**

#### Functions Setup
1. Go to **Functions**
2. Click **Get started**
3. Upgrade to **Blaze plan** (pay-as-you-go) - required for Cloud Functions

### 1.3 Get Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click **Web app** icon (`</>`)
4. Register app name: `edumanage-frontend`
5. Copy the Firebase config object

## 📋 Step 2: Backend Setup

### 2.1 Install Dependencies
```bash
cd backend/functions
npm install
```

### 2.2 Initialize Firebase
```bash
# From project root
firebase login
firebase init

# Select:
# - Functions: Configure and deploy Cloud Functions
# - Firestore: Deploy rules and create indexes
# - Storage: Deploy rules
# - Hosting: Configure and deploy Firebase Hosting sites

# Choose existing project: edumanage-system
# Language: JavaScript
# ESLint: Yes
# Install dependencies: Yes
```

### 2.3 Update Firebase Configuration
Update `backend/functions/package.json` if needed and ensure all dependencies are installed:

```bash
cd backend/functions
npm install firebase-admin firebase-functions cors express nodemailer moment uuid
```

## 📋 Step 3: Database Setup and Rules

### 3.1 Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### 3.2 Deploy Firestore Indexes
```bash
firebase deploy --only firestore:indexes
```

### 3.3 Deploy Storage Rules
```bash
firebase deploy --only storage
```

## 📋 Step 4: Sample Data Insertion

### 4.1 Create Data Initialization Script
Create `backend/functions/scripts/initializeData.js`:

```javascript
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initializeData() {
  try {
    // Create Super Admin User
    const superAdminUser = await admin.auth().createUser({
      email: 'admin@gmail.com',
      password: 'admin@123',
      displayName: 'Super Admin'
    });

    await db.collection('users').doc(superAdminUser.uid).set({
      uid: superAdminUser.uid,
      email: 'admin@gmaile.com',
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
      password: teacher@123',
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

    console.log('Sample data initialized successfully!');
    console.log('Login Credentials:');
    console.log('Super Admin: admin@edumanage.com / Admin@123');
    console.log('Teacher: teacher@edumanage.com / Teacher@123');
    console.log('Student: student@edumanage.com / Student@123');
    
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

initializeData();
```

### 4.2 Get Service Account Key
1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Save as `backend/functions/scripts/serviceAccountKey.json`
4. **Never commit this file to version control**

### 4.3 Run Data Initialization
```bash
cd backend/functions/scripts
node initializeData.js
```

## 📋 Step 5: Frontend Configuration

### 5.1 Update Frontend Firebase Config
Update `frontend/src/config/firebase.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  // Paste your Firebase config here from Step 1.3
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export default app;
```

### 5.2 Install Frontend Dependencies
```bash
cd frontend
npm install
```

## 📋 Step 6: Backend Deployment

### 6.1 Deploy Cloud Functions
```bash
# From project root
firebase deploy --only functions
```

### 6.2 Set Environment Variables for Functions
```bash
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.password="your-app-password"
```

### 6.3 Deploy Complete Backend
```bash
firebase deploy
```

## 📋 Step 7: Frontend Deployment to Vercel

### 7.1 Build Frontend
```bash
cd frontend
npm run build
```

### 7.2 Deploy to Vercel
```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from frontend directory
cd frontend
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name: edumanage-frontend
# - Directory: ./
# - Override settings? No
```

### 7.3 Configure Environment Variables in Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings > Environment Variables
4. Add the following variables:

```
VITE_FIREBASE_API_KEY= AIzaSyCWhFJhfMhFGJV6mfBPyAIHSYjg1vu-kTg,
VITE_FIREBASE_AUTH_DOMAIN=sapms-82828.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=sapms-82828
VITE_FIREBASE_STORAGE_BUCKET=sapms-82828.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=965672925293
VITE_FIREBASE_APP_ID=1:965672925293:web:8e2e9b2ea38517f7d82764


 measurementId: "G-01M7DERK37"



### 7.4 Update Frontend Config for Production
Update `frontend/src/config/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

### 7.5 Redeploy Frontend
```bash
vercel --prod
```

## 📋 Step 8: Testing and Verification

### 8.1 Test Authentication
1. Visit your Vercel deployment URL
2. Try logging in with sample credentials:
   - Super Admin: `admin@edumanage.com` / `Admin@123`
   - Teacher: `teacher@edumanage.com` / `Teacher@123`
   - Student: `student@edumanage.com` / `Student@123`

### 8.2 Test Backend Functions
```bash
# Test health check
curl https://your-region-your-project.cloudfunctions.net/healthCheck
```

### 8.3 Monitor Logs
```bash
# View function logs
firebase functions:log

# View specific function logs
firebase functions:log --only createUser
```

## 📋 Step 9: Production Optimizations

### 9.1 Update Firestore Rules for Production
Replace test mode rules with production rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Your production rules from backend/firestore.rules
  }
}
```

### 9.2 Update Storage Rules for Production
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Your production rules from backend/storage.rules
  }
}
```

### 9.3 Enable Firebase Security Rules
```bash
firebase deploy --only firestore:rules,storage
```

## 🔧 Troubleshooting

### Common Issues:

1. **Functions deployment fails**
   - Ensure you're on Blaze plan
   - Check Node.js version compatibility
   - Verify all dependencies are installed

2. **Frontend can't connect to backend**
   - Verify Firebase config is correct
   - Check CORS settings in functions
   - Ensure functions are deployed

3. **Authentication issues**
   - Verify email/password is enabled
   - Check Firebase config
   - Ensure users exist in Authentication tab

4. **Database permission errors**
   - Check Firestore rules
   - Verify user roles in database
   - Test rules in Firebase Console

## 📝 Final Checklist

- [ ] Firebase project created and configured
- [ ] Authentication enabled with sample users
- [ ] Firestore database with rules deployed
- [ ] Storage configured with rules
- [ ] Cloud Functions deployed successfully
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] Sample data initialized
- [ ] Login functionality tested
- [ ] Backend functions responding
- [ ] Production rules applied

## 🎉 Success!

Your EduManage system is now fully deployed and ready for use!

- **Frontend URL**: Your Vercel deployment URL
- **Backend**: Firebase Cloud Functions
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth

Access the system with the sample credentials and start managing your educational institution!
