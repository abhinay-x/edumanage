import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  getAuth
} from 'firebase/auth'
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import toast from 'react-hot-toast'
import SessionManager from '../utils/sessionManager'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sessionToken, setSessionToken] = useState(null)

  // Sign up function
  const signup = async (email, password, userData) => {
    try {
      const { user: authUser } = await createUserWithEmailAndPassword(auth, email, password)
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', authUser.uid), {
        uid: authUser.uid,
        email: authUser.email,
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      toast.success('Account created successfully!')
      return authUser
    } catch (error) {
      console.error('Signup error:', error)
      toast.error(error.message)
      throw error
    }
  }

  // Find user by email in Firestore
  const getUserByEmail = async (email) => {
    try {
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('email', '==', email))
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data()
      }
      return null
    } catch (error) {
      console.error('Error finding user by email:', error)
      return null
    }
  }

  // Determine user role based on email domain or patterns
  const determineUserRole = (email) => {
    const emailLower = email.toLowerCase()
    console.log('Determining role for email:', emailLower)
    
    // Admin email patterns
    if (emailLower.includes('admin') || emailLower.includes('super') || 
        emailLower.endsWith('@admin.edu') || emailLower.includes('administrator')) {
      console.log('Detected admin role')
      return 'super_admin'
    }
    
    // Teacher email patterns - more comprehensive detection
    if (emailLower.includes('teacher') || emailLower.includes('faculty') || 
        emailLower.includes('prof') || emailLower.includes('instructor') ||
        emailLower.includes('educator') || emailLower.includes('tutor') ||
        emailLower.endsWith('@teacher.edu') || emailLower.endsWith('@faculty.edu') ||
        emailLower.endsWith('@staff.edu')) {
      console.log('Detected teacher role')
      return 'teacher'
    }
    
    // Default to student
    console.log('Defaulting to student role')
    return 'student'
  }

  // Sign in function with session management
  const signin = async (email, password, rememberMe = false) => {
    try {
      // Set persistence based on rememberMe choice
      if (rememberMe) {
        await setPersistence(auth, browserLocalPersistence)
        console.log('Set persistence to LOCAL (remember me)')
      } else {
        await setPersistence(auth, browserSessionPersistence)
        console.log('Set persistence to SESSION (do not remember)')
      }
      
      const result = await signInWithEmailAndPassword(auth, email, password)
      const authUser = result.user
      console.log('Firebase auth successful for:', authUser.email)
      
      // Generate session token and data
      const token = await authUser.getIdToken()
      const sessionData = {
        uid: authUser.uid,
        email: authUser.email,
        loginTime: Date.now(),
        rememberMe: rememberMe
      }
      
      if (rememberMe) {
        localStorage.setItem('userSession', JSON.stringify(sessionData))
        localStorage.setItem('authToken', token)
        localStorage.setItem('rememberMe', 'true')
      } else {
        sessionStorage.setItem('userSession', JSON.stringify(sessionData))
        sessionStorage.setItem('authToken', token)
        localStorage.removeItem('rememberMe')
      }
      
      // Check if user document exists by UID
      let userProfile = await getUserProfile(authUser.uid)
      console.log('User profile found:', userProfile)
      
      // If no document by UID, create new user document with role detection
      if (!userProfile) {
        console.log('Creating new user profile...')
        const detectedRole = determineUserRole(authUser.email)
        
        const newUserData = {
          uid: authUser.uid,
          email: authUser.email,
          role: detectedRole,
          firstName: authUser.displayName?.split(' ')[0] || (detectedRole === 'super_admin' ? 'Admin' : detectedRole === 'teacher' ? 'Teacher' : 'Student'),
          lastName: authUser.displayName?.split(' ')[1] || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        await setDoc(doc(db, 'users', authUser.uid), newUserData)
        console.log('Created user with role:', detectedRole, 'for email:', authUser.email)
        
        const roleMessage = detectedRole === 'super_admin' ? 'admin' : detectedRole
        toast.success(`Welcome! Your account has been set up with ${roleMessage} access.`)
        
        // Return the new user data
        userProfile = newUserData
      } else {
        toast.success('Signed in successfully!')
      }
      
      // Set user data immediately after successful signin
      const userData = {
        uid: authUser.uid,
        email: authUser.email,
        ...userProfile
      }
      
      console.log('Setting user data after signin:', userData)
      setUser(userData)
      setSessionToken(token)
      
      // Handle redirect based on role
      const role = userProfile.role
      console.log('Redirecting after signin with role:', role)
      
      setTimeout(() => {
        if (role === 'super_admin') {
          window.location.replace('/admin')
        } else if (role === 'teacher') {
          window.location.replace('/teacher')
        } else if (role === 'student') {
          window.location.replace('/student')
        } else {
          console.log('Unknown role:', role)
        }
      }, 1000)
      
      return authUser
    } catch (error) {
      console.error('Signin error:', error)
      toast.error('Invalid email or password')
      throw error
    }
  }

  // Enhanced logout function
  const logout = async (skipConfirmation = false) => {
    console.log('=== LOGOUT INITIATED ===')
    
    try {
      // Show confirmation dialog unless explicitly skipped
      if (!skipConfirmation) {
        const confirmed = window.confirm('Are you sure you want to log out?')
        if (!confirmed) {
          console.log('User cancelled logout')
          return false
        }
      }

      console.log('Starting logout process...')
      
      // Step 1: Clear user state immediately
      console.log('Clearing user state...')
      setUser(null)
      setSessionToken(null)
      setLoading(false)
      
      // Step 2: Sign out from Firebase
      console.log('Signing out from Firebase...')
      await signOut(auth)
      
      // Step 3: Clear all storage
      console.log('Clearing storage...')
      try {
        localStorage.clear()
        sessionStorage.clear()
      } catch (e) {
        console.warn('Storage clear error:', e)
      }
      
      // Step 4: Clear cookies
      console.log('Clearing cookies...')
      try {
        document.cookie.split(";").forEach((c) => {
          const eqPos = c.indexOf("=")
          const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim()
          if (name) {
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname
          }
        })
      } catch (e) {
        console.warn('Cookie clear error:', e)
      }
      
      console.log('Logout completed successfully')
      toast.success('Signed out successfully!')
      
      // Step 5: Force redirect to login page
      console.log('Redirecting to login...')
      setTimeout(() => {
        window.location.href = '/login'
      }, 100)
      
      return true
      
    } catch (error) {
      console.error('=== LOGOUT ERROR ===', error)
      toast.error('Error signing out: ' + error.message)
      
      // Force redirect even on error
      setTimeout(() => {
        window.location.href = '/login'
      }, 1000)
      
      return false
    }
  }

  // Reset password function
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('Password reset email sent!')
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error('Error sending reset email')
      throw error
    }
  }

  // Get user profile data
  const getUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        return userDoc.data()
      }
      return null
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  // Token refresh function
  const refreshToken = async () => {
    try {
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken(true)
        setSessionToken(token)
        
        // Update stored token
        const sessionData = sessionStorage.getItem('userSession') || localStorage.getItem('userSession')
        if (sessionData) {
          const isLocalStorage = localStorage.getItem('userSession')
          if (isLocalStorage) {
            localStorage.setItem('authToken', token)
          } else {
            sessionStorage.setItem('authToken', token)
          }
        }
        
        return token
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      return null
    }
  }

  // Validate session function
  const validateSession = async () => {
    try {
      const sessionData = sessionStorage.getItem('userSession') || localStorage.getItem('userSession')
      const storedToken = sessionStorage.getItem('authToken') || localStorage.getItem('authToken')
      
      if (!sessionData || !storedToken) {
        return false
      }

      const session = JSON.parse(sessionData)
      const now = Date.now()
      const sessionAge = now - session.timestamp
      
      // Session expires after 24 hours for localStorage, 1 hour for sessionStorage
      const maxAge = session.rememberMe ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000
      
      if (sessionAge > maxAge) {
        console.log('Session expired, clearing data')
        await logout(true) // Skip confirmation for expired sessions
        return false
      }
      
      return true
    } catch (error) {
      console.error('Session validation error:', error)
      return false
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Use SessionManager to initialize clean session
        const hasValidSession = await SessionManager.initializeCleanSession()
        console.log('Session initialization result:', hasValidSession)
      } catch (error) {
        console.error('Error initializing auth:', error)
      }
    }
    
    // Initialize auth on app start
    initializeAuth()
    
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      console.log('Auth state changed:', authUser?.email)
      
      if (authUser) {
        try {
          // Get fresh token
          const token = await authUser.getIdToken()
          setSessionToken(token)
          
          // Get user profile from Firestore
          const userProfile = await getUserProfile(authUser.uid)
          console.log('User profile from Firestore:', userProfile)
          
          if (userProfile) {
            const userData = {
              uid: authUser.uid,
              email: authUser.email,
              ...userProfile
            }
            
            console.log('Setting user data:', userData)
            setUser(userData)
            
            // Handle redirect after successful authentication
            const currentPath = window.location.pathname
            console.log('Current path:', currentPath)
            
            if (currentPath === '/login' || currentPath === '/') {
              const role = userProfile.role
              console.log('Redirecting user with role:', role)
              
              setTimeout(() => {
                if (role === 'super_admin') {
                  window.location.replace('/admin')
                } else if (role === 'teacher') {
                  window.location.replace('/teacher')
                } else if (role === 'student') {
                  window.location.replace('/student')
                } else {
                  console.log('Unknown role:', role)
                  window.location.replace('/login')
                }
              }, 500)
            }
          } else {
            console.log('No user profile found, logging out')
            await signOut(auth)
            setUser(null)
            setSessionToken(null)
          }
        } catch (error) {
          console.error('Error in auth state change:', error)
          setUser(null)
          setSessionToken(null)
        }
      } else {
        console.log('No auth user, clearing state')
        setUser(null)
        setSessionToken(null)
      }
      setLoading(false)
    })

    // Set up token refresh interval (every 50 minutes)
    const tokenRefreshInterval = setInterval(() => {
      if (auth.currentUser) {
        refreshToken()
      }
    }, 50 * 60 * 1000)

    return () => {
      unsubscribe()
      clearInterval(tokenRefreshInterval)
    }
  }, [])

  const value = {
    user,
    loading,
    sessionToken,
    signup,
    signin,
    logout,
    resetPassword,
    getUserProfile,
    refreshToken,
    validateSession
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
