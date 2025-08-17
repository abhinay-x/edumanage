import { signOut, setPersistence, browserSessionPersistence } from 'firebase/auth'
import { auth } from '../config/firebase'

// Session management utility
export class SessionManager {
  static SESSION_KEY = 'edumanage_session'
  static TOKEN_KEY = 'edumanage_token'
  
  // Clear all authentication data
  static clearAllAuthData() {
    // Clear localStorage
    const localStorageKeys = Object.keys(localStorage)
    localStorageKeys.forEach(key => {
      if (key.includes('firebase') || key.includes('auth') || key.includes('session') || key.includes('token') || key.includes('edumanage')) {
        localStorage.removeItem(key)
      }
    })
    
    // Clear sessionStorage
    const sessionStorageKeys = Object.keys(sessionStorage)
    sessionStorageKeys.forEach(key => {
      if (key.includes('firebase') || key.includes('auth') || key.includes('session') || key.includes('token') || key.includes('edumanage')) {
        sessionStorage.removeItem(key)
      }
    })
    
    // Clear specific known keys
    localStorage.removeItem('authToken')
    localStorage.removeItem('userSession')
    localStorage.removeItem('rememberMe')
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('userSession')
    
    console.log('All auth data cleared')
  }
  
  // Check if user has valid session
  static hasValidSession() {
    const sessionData = sessionStorage.getItem('userSession') || localStorage.getItem('userSession')
    const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken')
    
    if (!sessionData || !token) {
      return false
    }
    
    try {
      const session = JSON.parse(sessionData)
      const now = Date.now()
      const sessionAge = now - session.timestamp
      
      // Session expires after 1 hour for sessionStorage, 24 hours for localStorage
      const maxAge = session.rememberMe ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000
      
      return sessionAge <= maxAge
    } catch (error) {
      console.error('Error validating session:', error)
      return false
    }
  }
  
  // Force logout and clear everything
  static async forceLogout() {
    try {
      // Clear all data first
      this.clearAllAuthData()
      
      // Sign out from Firebase
      if (auth.currentUser) {
        await signOut(auth)
      }
      
      // Reset persistence to session-only
      await setPersistence(auth, browserSessionPersistence)
      
      console.log('Force logout completed')
      return true
    } catch (error) {
      console.error('Error during force logout:', error)
      return false
    }
  }
  
  // Initialize clean session
  static async initializeCleanSession() {
    try {
      // Check if we should have a valid session
      const hasValidSession = this.hasValidSession()
      
      if (!hasValidSession && auth.currentUser) {
        // Firebase has user but we don't have valid session data
        console.log('Firebase auth persisted without session data, clearing...')
        await this.forceLogout()
        return false
      }
      
      // Set session-only persistence as default
      await setPersistence(auth, browserSessionPersistence)
      return hasValidSession
    } catch (error) {
      console.error('Error initializing session:', error)
      return false
    }
  }
}

export default SessionManager
