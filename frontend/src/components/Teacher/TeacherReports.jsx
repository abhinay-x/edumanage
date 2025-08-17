import React, { useState, useEffect } from 'react'
import { FileText, Download, Calendar, BarChart3, Users, TrendingUp, Clock, Award, UserCheck, Filter, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

const TeacherReports = () => {
  const [activeTab, setActiveTab] = useState('generate')
  const [reportType, setReportType] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [generatedReports, setGeneratedReports] = useState([])
  const [loading, setLoading] = useState(false)

  const [classes, setClasses] = useState([])
  const [reportTemplates, setReportTemplates] = useState([])

  useEffect(() => {
    // Mock data
    const mockClasses = [
      { id: 1, name: 'Grade 10 A - Mathematics', totalStudents: 32 },
      { id: 2, name: 'Grade 10 B - Mathematics', totalStudents: 30 },
      { id: 3, name: 'Grade 11 A - Advanced Mathematics', totalStudents: 28 }
    ]

    const mockReportTemplates = [
      {
        id: 'student-performance',
        name: 'Student Performance Report',
        description: 'Comprehensive report on individual student academic performance',
        icon: Award,
        category: 'Academic',
        fields: ['grades', 'assignments', 'participation', 'improvement']
      },
      {
        id: 'class-attendance',
        name: 'Class Attendance Report',
        description: 'Detailed attendance tracking and patterns for the class',
        icon: UserCheck,
        category: 'Attendance',
        fields: ['daily_attendance', 'patterns', 'tardiness', 'absences']
      },
      {
        id: 'grade-distribution',
        name: 'Grade Distribution Analysis',
        description: 'Statistical analysis of grade distribution and trends',
        icon: BarChart3,
        category: 'Academic',
        fields: ['grade_averages', 'distribution', 'trends', 'comparisons']
      },
      {
        id: 'assignment-analysis',
        name: 'Assignment Performance Analysis',
        description: 'Analysis of assignment completion and performance rates',
        icon: FileText,
        category: 'Academic',
        fields: ['completion_rates', 'performance', 'late_submissions', 'trends']
      },
      {
        id: 'parent-communication',
        name: 'Parent Communication Summary',
        description: 'Summary of parent-teacher communications and student progress',
        icon: Users,
        category: 'Communication',
        fields: ['meetings', 'messages', 'concerns', 'progress_updates']
      }
    ]

    const mockGeneratedReports = [
      {
        id: 1,
        name: 'Grade 10A Performance Report - March 2024',
        type: 'Student Performance Report',
        class: 'Grade 10 A - Mathematics',
        dateGenerated: '2024-03-15T10:30:00Z',
        dateRange: { start: '2024-03-01', end: '2024-03-15' },
        status: 'completed',
        fileSize: '2.4 MB'
      },
      {
        id: 2,
        name: 'Attendance Summary - Week 11',
        type: 'Class Attendance Report',
        class: 'Grade 10 A - Mathematics',
        dateGenerated: '2024-03-14T16:45:00Z',
        dateRange: { start: '2024-03-11', end: '2024-03-15' },
        status: 'completed',
        fileSize: '1.8 MB'
      },
      {
        id: 3,
        name: 'Assignment Analysis - Q1 2024',
        type: 'Assignment Performance Analysis',
        class: 'All Classes',
        dateGenerated: '2024-03-13T14:20:00Z',
        dateRange: { start: '2024-01-01', end: '2024-03-31' },
        status: 'completed',
        fileSize: '3.2 MB'
      }
    ]

    setClasses(mockClasses)
    setReportTemplates(mockReportTemplates)
    setGeneratedReports(mockGeneratedReports)
  }, [])

  const handleGenerateReport = async () => {
    if (!reportType || !selectedClass) {
      toast.error('Please select report type and class')
      return
    }

    setLoading(true)
    
    // Simulate report generation
    setTimeout(() => {
      const template = reportTemplates.find(t => t.id === reportType)
      const classInfo = classes.find(c => c.id === parseInt(selectedClass))
      
      const newReport = {
        id: Date.now(),
        name: `${template.name} - ${classInfo.name} - ${new Date().toLocaleDateString()}`,
        type: template.name,
        class: classInfo.name,
        dateGenerated: new Date().toISOString(),
        dateRange: dateRange,
        status: 'completed',
        fileSize: `${(Math.random() * 3 + 1).toFixed(1)} MB`
      }

      setGeneratedReports(prev => [newReport, ...prev])
      setLoading(false)
      toast.success('Report generated successfully!')
      
      // Reset form
      setReportType('')
      setSelectedClass('')
      setDateRange({ start: '', end: '' })
    }, 3000)
  }

  const downloadReport = (reportId) => {
    toast.success('Report download started!')
  }

  const viewReport = (reportId) => {
    toast.info('Opening report preview...')
  }

  const deleteReport = (reportId) => {
    setGeneratedReports(prev => prev.filter(r => r.id !== reportId))
    toast.success('Report deleted successfully!')
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Academic': return 'bg-blue-100 text-blue-800'
      case 'Attendance': return 'bg-green-100 text-green-800'
      case 'Communication': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and manage class and student reports</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('generate')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'generate'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Generate Reports
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Report History
          </button>
        </nav>
      </div>

      {/* Generate Reports Tab */}
      {activeTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Templates */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Report Templates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((template) => {
                  const IconComponent = template.icon
                  return (
                    <div
                      key={template.id}
                      onClick={() => setReportType(template.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        reportType === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-gray-900">{template.name}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(template.category)}`}>
                              {template.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {template.fields.map((field, index) => (
                              <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                {field.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Report Configuration */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selected Template</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      {reportType ? reportTemplates.find(t => t.id === reportType)?.name : 'No template selected'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Class</option>
                    <option value="all">All Classes</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerateReport}
                  disabled={loading || !reportType || !selectedClass}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Reports Generated:</span>
                  <span className="font-medium">{generatedReports.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">This Month:</span>
                  <span className="font-medium">
                    {generatedReports.filter(r => new Date(r.dateGenerated).getMonth() === new Date().getMonth()).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Most Used Template:</span>
                  <span className="font-medium text-sm">Performance Report</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Generated Reports</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {generatedReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{report.name}</div>
                      {report.dateRange.start && (
                        <div className="text-sm text-gray-500">
                          {new Date(report.dateRange.start).toLocaleDateString()} - {new Date(report.dateRange.end).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.class}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.dateGenerated).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.fileSize}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewReport(report.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Report"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadReport(report.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Download Report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteReport(report.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Report"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherReports
