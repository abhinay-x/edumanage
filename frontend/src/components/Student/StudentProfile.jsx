import React from 'react'
import { User, Settings, Edit } from 'lucide-react'

const StudentProfile = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">Manage your profile and account settings</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Settings</h3>
        <p className="text-gray-500 mb-4">
          Update your personal information, preferences, and account settings.
        </p>
        <button className="btn btn-primary">
          Edit Profile
        </button>
      </div>
    </div>
  )
}

export default StudentProfile
