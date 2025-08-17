import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {

  apiKey: "AIzaSyCWhFJhfMhFGJV6mfBPyAIHSYjg1vu-kTg",

  authDomain: "sapms-82828.firebaseapp.com",

  projectId: "sapms-82828",

  storageBucket: "sapms-82828.firebasestorage.app",

  messagingSenderId: "965672925293",

  appId: "1:965672925293:web:8e2e9b2ea38517f7d82764",

  measurementId: "G-01M7DERK37"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
