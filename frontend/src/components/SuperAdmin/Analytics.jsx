import React from 'react'
import { BarChart3, TrendingUp, Users, BookOpen } from 'lucide-react'

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive insights and performance metrics</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
        <p className="text-gray-500 mb-4">
          Advanced analytics with AI-powered insights for data-driven decisions.
        </p>
        <button className="btn btn-primary">
          View Analytics
        </button>
      </div>
    </div>
  )
}

export default Analytics
