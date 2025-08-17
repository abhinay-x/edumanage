import React from 'react'
import { Calendar, Clock, Users } from 'lucide-react'

const TimetableBuilder = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Timetable Builder</h1>
        <p className="text-gray-600">Create and manage class schedules with AI assistance</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Timetable Builder</h3>
        <p className="text-gray-500 mb-4">
          AI-powered timetable generation with conflict detection and optimization.
        </p>
        <button className="btn btn-primary">
          Create New Timetable
        </button>
      </div>
    </div>
  )
}

export default TimetableBuilder
