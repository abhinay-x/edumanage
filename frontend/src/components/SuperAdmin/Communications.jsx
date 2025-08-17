import React from 'react'
import { MessageSquare, Bell, Mail } from 'lucide-react'

const Communications = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
        <p className="text-gray-600">Manage announcements and messaging system</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Communication Hub</h3>
        <p className="text-gray-500 mb-4">
          Send announcements, manage messages, and communicate with all stakeholders.
        </p>
        <button className="btn btn-primary">
          Create Announcement
        </button>
      </div>
    </div>
  )
}

export default Communications
