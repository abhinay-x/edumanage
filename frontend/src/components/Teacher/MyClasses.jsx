import React from 'react'
import { Users, BookOpen, Calendar } from 'lucide-react'

const MyClasses = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
        <p className="text-gray-600">Manage your assigned classes and students</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Class Management</h3>
        <p className="text-gray-500 mb-4">
          View and manage all your assigned classes, student rosters, and class schedules.
        </p>
        <button className="btn btn-primary">
          View Classes
        </button>
      </div>
    </div>
  )
}

export default MyClasses
