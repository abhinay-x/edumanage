import React, { useState, useEffect } from 'react'
import { FileText, Download, Calendar, Filter, BarChart3, Users, BookOpen, TrendingUp, Eye, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'

const Reports = () => {
  const [activeCategory, setActiveCategory] = useState('academic')
  const [selectedReport, setSelectedReport] = useState(null)
  const [dateRange, setDateRange] = useState('month')
  const [customDateFrom, setCustomDateFrom] = useState('')
  const [customDateTo, setCustomDateTo] = useState('')
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState({})

  const reportCategories = {
    academic: {
      name: 'Academic Reports',
      icon: BookOpen,
      reports: [
        {
          id: 'student-performance',
          name: 'Student Performance Report',
          description: 'Comprehensive analysis of student grades and academic progress',
          type: 'detailed',
          lastGenerated: '2024-03-01',
          size: '2.4 MB'
        },
        {
          id: 'subject-analysis',
          name: 'Subject-wise Analysis',
          description: 'Performance breakdown by subjects and grade levels',
          type: 'summary',
          lastGenerated: '2024-02-28',
          size: '1.8 MB'
        },
        {
          id: 'grade-distribution',
          name: 'Grade Distribution Report',
          description: 'Statistical analysis of grade distributions across all classes',
          type: 'statistical',
          lastGenerated: '2024-02-25',
          size: '956 KB'
        }
      ]
    },
    attendance: {
      name: 'Attendance Reports',
      icon: Calendar,
      reports: [
        {
          id: 'attendance-summary',
          name: 'Attendance Summary',
          description: 'Overall attendance statistics and trends',
          type: 'summary',
          lastGenerated: '2024-03-02',
          size: '1.2 MB'
        },
        {
          id: 'chronic-absenteeism',
          name: 'Chronic Absenteeism Report',
          description: 'Students with attendance below threshold levels',
          type: 'alert',
          lastGenerated: '2024-03-01',
          size: '654 KB'
        },
        {
          id: 'class-attendance',
          name: 'Class-wise Attendance',
          description: 'Attendance patterns by class and subject',
          type: 'detailed',
          lastGenerated: '2024-02-29',
          size: '2.1 MB'
        }
      ]
    },
    financial: {
      name: 'Financial Reports',
      icon: BarChart3,
      reports: [
        {
          id: 'fee-collection',
          name: 'Fee Collection Report',
          description: 'Fee payment status and outstanding amounts',
          type: 'financial',
          lastGenerated: '2024-03-01',
          size: '1.5 MB'
        },
        {
          id: 'budget-analysis',
          name: 'Budget Analysis',
          description: 'Budget allocation and expenditure analysis',
          type: 'financial',
          lastGenerated: '2024-02-28',
          size: '3.2 MB'
        },
        {
          id: 'scholarship-report',
          name: 'Scholarship Report',
          description: 'Scholarship distribution and eligibility analysis',
          type: 'summary',
          lastGenerated: '2024-02-25',
          size: '876 KB'
        }
      ]
    },
    administrative: {
      name: 'Administrative Reports',
      icon: Users,
      reports: [
        {
          id: 'staff-performance',
          name: 'Staff Performance Report',
          description: 'Teacher effectiveness and performance metrics',
          type: 'detailed',
          lastGenerated: '2024-03-01',
          size: '2.8 MB'
        },
        {
          id: 'enrollment-report',
          name: 'Enrollment Report',
          description: 'Student enrollment trends and projections',
          type: 'statistical',
          lastGenerated: '2024-02-28',
          size: '1.3 MB'
        },
        {
          id: 'facility-utilization',
          name: 'Facility Utilization Report',
          description: 'Classroom and resource utilization analysis',
          type: 'summary',
          lastGenerated: '2024-02-26',
          size: '1.1 MB'
        }
      ]
    }
  }

  useEffect(() => {
    // Mock report data
    const mockReportData = {
      'student-performance': {
        summary: {
          totalStudents: 1250,
          averageGPA: 3.42,
          improvementRate: 12.5,
          atRiskStudents: 45
        },
        charts: [
          { type: 'line', title: 'GPA Trends', data: [3.2, 3.3, 3.4, 3.42] },
          { type: 'bar', title: 'Grade Distribution', data: [125, 250, 300, 275, 200, 75, 25] }
        ]
      },
      'attendance-summary': {
        summary: {
          overallAttendance: 92.5,
          totalDays: 180,
          presentDays: 166,
          chronicAbsentees: 23
        },
        charts: [
          { type: 'line', title: 'Monthly Attendance', data: [93.2, 94.1, 92.8, 91.5, 92.5] }
        ]
      }
    }
    setReportData(mockReportData)
  }, [])

  const generateReport = async (reportId) => {
    setLoading(true)
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Report generated successfully!')
      
      // Update last generated date
      const updatedCategories = { ...reportCategories }
      Object.keys(updatedCategories).forEach(categoryKey => {
        updatedCategories[categoryKey].reports = updatedCategories[categoryKey].reports.map(report =>
          report.id === reportId 
            ? { ...report, lastGenerated: new Date().toISOString().split('T')[0] }
            : report
        )
      })
    } catch (error) {
      toast.error('Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = (reportId, format = 'pdf') => {
    toast.success(`Report downloaded as ${format.toUpperCase()}`)
  }

  const shareReport = (reportId) => {
    toast.success('Report sharing link generated')
  }

  const previewReport = (report) => {
    setSelectedReport(report)
  }

  const getReportTypeColor = (type) => {
    switch (type) {
      case 'detailed': return 'bg-blue-100 text-blue-800'
      case 'summary': return 'bg-green-100 text-green-800'
      case 'statistical': return 'bg-purple-100 text-purple-800'
      case 'financial': return 'bg-yellow-100 text-yellow-800'
      case 'alert': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and manage comprehensive school reports</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
          {dateRange === 'custom' && (
            <div className="flex space-x-2">
              <input
                type="date"
                value={customDateFrom}
                onChange={(e) => setCustomDateFrom(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={customDateTo}
                onChange={(e) => setCustomDateTo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Report Categories</h3>
            <div className="space-y-2">
              {Object.entries(reportCategories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                    activeCategory === key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <category.icon className="w-4 h-4 mr-2" />
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="lg:col-span-3">
          {!selectedReport ? (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  {React.createElement(reportCategories[activeCategory].icon, { className: "w-5 h-5 mr-2 text-blue-600" })}
                  <h2 className="text-lg font-semibold text-gray-900">
                    {reportCategories[activeCategory].name}
                  </h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  {reportCategories[activeCategory].reports.map((report) => (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="font-semibold text-gray-900 mr-3">{report.name}</h3>
                            <span className={`px-2 py-1 text-xs rounded ${getReportTypeColor(report.type)}`}>
                              {report.type}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{report.description}</p>
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <span>Last generated: {report.lastGenerated}</span>
                            <span>Size: {report.size}</span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          <button
                            onClick={() => previewReport(report)}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </button>
                          <button
                            onClick={() => generateReport(report.id)}
                            disabled={loading}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center disabled:opacity-50"
                          >
                            <TrendingUp className="w-4 h-4 mr-1" />
                            Generate
                          </button>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => downloadReport(report.id, 'pdf')}
                              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                            >
                              PDF
                            </button>
                            <button
                              onClick={() => downloadReport(report.id, 'excel')}
                              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                            >
                              Excel
                            </button>
                          </div>
                          <button
                            onClick={() => shareReport(report.id)}
                            className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 flex items-center"
                          >
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Report Preview */
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{selectedReport.name}</h2>
                    <p className="text-gray-600">{selectedReport.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    Back to Reports
                  </button>
                </div>
              </div>

              <div className="p-6">
                {reportData[selectedReport.id] ? (
                  <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(reportData[selectedReport.id].summary || {}).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                          <p className="text-2xl font-bold text-gray-900">{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Charts Placeholder */}
                    <div className="space-y-4">
                      {reportData[selectedReport.id].charts?.map((chart, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold mb-4">{chart.title}</h4>
                          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                              <p>{chart.type.charAt(0).toUpperCase() + chart.type.slice(1)} Chart</p>
                              <p className="text-sm">Chart visualization would appear here</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => downloadReport(selectedReport.id, 'pdf')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </button>
                      <button
                        onClick={() => downloadReport(selectedReport.id, 'excel')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Excel
                      </button>
                      <button
                        onClick={() => shareReport(selectedReport.id)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Report
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Report data not available. Generate report to view details.</p>
                    <button
                      onClick={() => generateReport(selectedReport.id)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Generate Report
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reports
