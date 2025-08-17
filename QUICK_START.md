# 🚀 EduManage Quick Start Guide

## Prerequisites Installation

```bash
# Install Node.js 18+
# Download from https://nodejs.org/

# Install Firebase CLI
npm install -g firebase-tools

# Install Vercel CLI  
npm install -g vercel

# Login to Firebase
firebase login

# Login to Vercel
vercel login
```

## 🔥 Firebase Setup (5 minutes)

### 1. Create Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" → Enter `edumanage-system`
3. Enable Google Analytics (optional) → Create project

### 2. Enable Services
**Authentication:**
- Go to Authentication → Sign-in method
- Enable Email/Password → Save

**Firestore:**
- Go to Firestore Database → Create database
- Start in test mode → Choose location → Done

**Storage:**
- Go to Storage → Get started
- Start in test mode → Choose location → Done

**Functions:**
- Go to Functions → Get started
- Upgrade to Blaze plan (required for Cloud Functions)

### 3. Get Config
- Project Settings → Your apps → Web app
- Register app: `edumanage-frontend`
- Copy Firebase config object

## 🛠️ Backend Deployment

```bash
# Navigate to backend
cd backend

# Initialize Firebase
firebase init
# Select: Functions, Firestore, Storage, Hosting
# Choose existing project: edumanage-system
# Language: JavaScript
# ESLint: Yes
# Install dependencies: Yes

# Install function dependencies
cd functions
npm install

# Deploy backend
firebase deploy
```

## 📊 Initialize Sample Data

### 1. Get Service Account Key
1. Firebase Console → Project Settings → Service Accounts
2. Generate new private key → Save as `backend/functions/scripts/serviceAccountKey.json`

### 2. Run Data Script
```bash
cd backend/functions/scripts
node initializeData.js
```

**Sample Login Credentials:**
- Super Admin: `admin@edumanage.com` / `Admin@123`
- Teacher: `teacher@edumanage.com` / `Teacher@123`  
- Student: `student@edumanage.com` / `Student@123`

## 🌐 Frontend Deployment

### 1. Update Config
Update `frontend/src/config/firebase.js` with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 2. Deploy to Vercel
```bash
cd frontend
npm install
npm run build
vercel

# Follow prompts:
# Project name: edumanage-frontend
# Directory: ./
```

### 3. Add Environment Variables
In Vercel Dashboard → Your Project → Settings → Environment Variables:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Update Config for Production
```javascript
// frontend/src/config/firebase.js
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

### 5. Redeploy
```bash
vercel --prod
```

## ✅ Test Your Deployment

1. Visit your Vercel URL
2. Login with sample credentials
3. Test different user roles
4. Verify backend functions work

## 🔒 Production Security

### Update Firestore Rules
```bash
firebase deploy --only firestore:rules,storage
```

## 🎉 You're Done!

Your EduManage system is now live with:
- ✅ Complete authentication system
- ✅ Role-based dashboards  
- ✅ Cloud Functions backend
- ✅ Real-time database
- ✅ File storage
- ✅ Sample data loaded

**Total Setup Time: ~15 minutes**

## 📞 Support

If you encounter issues:
1. Check Firebase Console logs
2. View Vercel deployment logs
3. Test functions: `firebase functions:log`
4. Verify environment variables are set correctly
