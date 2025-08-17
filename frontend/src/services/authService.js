// src/services/authService.js
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    sendPasswordResetEmail,
    sendEmailVerification,
    updateProfile
  } from 'firebase/auth';
  import { doc, setDoc, getDoc } from 'firebase/firestore';
  import { auth, db } from '../config/firebase';
  import axios from 'axios';
  
  const API_URL = import.meta.env.VITE_API_URL;
  
  class AuthService {
    // Register new user
    async register({ email, password, firstName, lastName, role, additionalData = {} }) {
      try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        // Update user profile
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`
        });
  
        // Send email verification
        await sendEmailVerification(user);
  
        // Create user document in Firestore
        const userData = {
          uid: user.uid,
          email: user.email,
          firstName,
          lastName,
          role,
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          profile: {
            avatar: null,
            phone: null,
            address: null,
            ...additionalData
          }
        };
  
        await setDoc(doc(db, 'users', user.uid), userData);
  
        // Create role-specific document
        if (role === 'student') {
          await setDoc(doc(db, 'students', user.uid), {
            userId: user.uid,
            rollNumber: null,
            classId: null,
            admissionDate: new Date(),
            parentContact: additionalData.parentContact || null,
          });
        } else if (role === 'teacher') {
          await setDoc(doc(db, 'teachers', user.uid), {
            userId: user.uid,
            employeeId: null,
            department: additionalData.department || null,
            subjects: [],
            classes: [],
            joiningDate: new Date(),
          });
        }
  
        return { user, userData };
      } catch (error) {
        throw this.handleError(error);
      }
    }
  
    // Login user
    async login(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          throw new Error('User data not found');
        }
  
        const userData = userDoc.data();
        
        // Check if user is active
        if (!userData.isActive) {
          throw new Error('Account is deactivated. Contact administrator.');
        }
  
        return { user, userData };
      } catch (error) {
        throw this.handleError(error);
      }
    }
  
    // Logout user
    async logout() {
      try {
        await signOut(auth);
      } catch (error) {
        throw this.handleError(error);
      }
    }
  
    // Reset password
    async resetPassword(email) {
      try {
        await sendPasswordResetEmail(auth, email);
      } catch (error) {
        throw this.handleError(error);
      }
    }
  
    // Get current user data
    async getCurrentUserData(uid) {
      try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (!userDoc.exists()) {
          throw new Error('User data not found');
        }
        return userDoc.data();
      } catch (error) {
        throw this.handleError(error);
      }
    }
  
    // Handle Firebase errors
    handleError(error) {
      const errorMessages = {
        'auth/user-not-found': 'No user found with this email address',
        'auth/wrong-password': 'Invalid password',
        'auth/email-already-in-use': 'An account with this email already exists',
        'auth/weak-password': 'Password should be at least 6 characters',
        'auth/invalid-email': 'Invalid email address',
        'auth/too-many-requests': 'Too many attempts. Try again later',
        'auth/network-request-failed': 'Network error. Check your connection',
      };
  
      return new Error(errorMessages[error.code] || error.message);
    }
  }
  
  export default new AuthService();