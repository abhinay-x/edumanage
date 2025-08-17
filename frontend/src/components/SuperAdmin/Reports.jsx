import React from 'react'
import { FileText, Download, Filter } from 'lucide-react'

const Reports = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600">Generate and export comprehensive reports</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Report Generator</h3>
        <p className="text-gray-500 mb-4">
          Generate detailed reports on attendance, performance, and academic progress.
        </p>
        <button className="btn btn-primary">
          Generate Report
        </button>
      </div>
    </div>
  )
}

export default Reports
