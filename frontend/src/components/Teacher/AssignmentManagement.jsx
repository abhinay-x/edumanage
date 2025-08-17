import React from 'react'
import { ClipboardList, Plus, FileText } from 'lucide-react'

const AssignmentManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assignment Management</h1>
        <p className="text-gray-600">Create and manage assignments for your classes</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Assignment Hub</h3>
        <p className="text-gray-500 mb-4">
          Create assignments, track submissions, and provide feedback to students.
        </p>
        <button className="btn btn-primary">
          Create Assignment
        </button>
      </div>
    </div>
  )
}

export default AssignmentManagement
