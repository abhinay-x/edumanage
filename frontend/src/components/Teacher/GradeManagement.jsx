import React from 'react'
import { Award, BarChart3, FileText } from 'lucide-react'

const GradeManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Grade Management</h1>
        <p className="text-gray-600">Manage student grades and assessments</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Grade Book</h3>
        <p className="text-gray-500 mb-4">
          Enter grades, calculate averages, and track student progress with flexible grading systems.
        </p>
        <button className="btn btn-primary">
          Open Grade Book
        </button>
      </div>
    </div>
  )
}

export default GradeManagement
