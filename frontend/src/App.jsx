import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import StudentDashboard from './pages/StudentDashboard'
import NoRoleAssigned from './pages/NoRoleAssigned'
import LoadingSpinner from './components/LoadingSpinner'
import useBeforeUnload from './hooks/useBeforeUnload'

function DashboardRedirect() {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  console.log('DashboardRedirect - User:', user)
  console.log('DashboardRedirect - User role:', user?.role)
  
  // Navigation based on user role
  if (user?.role === 'super_admin') {
    console.log('Redirecting to admin dashboard')
    return <Navigate to="/admin" replace />
  } else if (user?.role === 'teacher') {
    console.log('Redirecting to teacher dashboard')
    return <Navigate to="/teacher" replace />
  } else if (user?.role === 'student') {
    console.log('Redirecting to student dashboard')
    return <Navigate to="/student" replace />
  } else {
    console.log('No role found, user:', user)
    // If user exists but no role, redirect to student by default
    // This handles edge cases where role assignment might be delayed
    if (user) {
      console.log('User exists but no role, defaulting to student')
      return <Navigate to="/student" replace />
    }
    return <NoRoleAssigned />
  }
}

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log(`Access denied: User role '${user.role}' not in allowed roles:`, allowedRoles)
    
    // Show warning and redirect to correct dashboard
    toast.error(`Access denied! You don't have permission to access this area. Redirecting to your dashboard...`)
    
    setTimeout(() => {
      if (user.role === 'super_admin') {
        navigate('/admin', { replace: true })
      } else if (user.role === 'teacher') {
        navigate('/teacher', { replace: true })
      } else if (user.role === 'student') {
        navigate('/student', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    }, 2000)
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Access Denied!</strong>
            <span className="block sm:inline"> You don't have permission to access this area.</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Unauthorized Access</h1>
          <p className="text-gray-600 mb-4">
            Your role ({user.role?.replace('_', ' ')}) doesn't have access to this dashboard.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting you to your authorized dashboard in 2 seconds...
          </p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }
  
  return children
}

function AppRoutes() {
  const { user, loading } = useAuth()
  
  // Remove global beforeunload warning - it should only be used on specific forms/pages
  // useBeforeUnload(!!user)
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardRedirect />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <SuperAdminDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/teacher/*" element={
        <ProtectedRoute allowedRoles={['teacher']}>
          <TeacherDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/student/*" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/unauthorized" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized Access</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      } />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
