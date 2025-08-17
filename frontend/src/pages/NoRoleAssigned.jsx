import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { AlertTriangle, Home, LogOut } from 'lucide-react'

const NoRoleAssigned = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleGoHome = () => {
    navigate('/')
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Role Assigned</h1>
          <p className="text-gray-600">
            Your account doesn't have a role assigned yet. Please contact your administrator to assign you a role (Teacher, Student, or Admin).
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Need help?</strong> Contact your system administrator to get your account role assigned.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NoRoleAssigned
