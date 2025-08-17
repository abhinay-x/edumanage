import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, TrendingDown, Users, BookOpen, Award, AlertTriangle, Download, Filter, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [dateRange, setDateRange] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState('performance')
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState({})

  useEffect(() => {
    // Mock analytics data
    const mockData = {
      overview: {
        totalStudents: 1250,
        totalTeachers: 85,
        totalClasses: 45,
        averageAttendance: 92.5,
        trends: {
          students: 5.2,
          teachers: 2.1,
          attendance: -1.3,
          performance: 3.8
        }
      },
      performance: {
        overallGPA: 3.42,
        subjectPerformance: [
          { subject: 'Mathematics', average: 3.8, trend: 'up', students: 320 },
          { subject: 'Physics', average: 3.6, trend: 'up', students: 280 },
          { subject: 'Chemistry', average: 3.4, trend: 'down', students: 275 },
          { subject: 'Biology', average: 3.7, trend: 'up', students: 290 },
          { subject: 'English', average: 3.9, trend: 'up', students: 350 },
          { subject: 'History', average: 3.3, trend: 'stable', students: 200 }
        ],
        gradeDistribution: [
          { grade: 'A+', count: 125, percentage: 10 },
          { grade: 'A', count: 250, percentage: 20 },
          { grade: 'B+', count: 300, percentage: 24 },
          { grade: 'B', count: 275, percentage: 22 },
          { grade: 'C+', count: 200, percentage: 16 },
          { grade: 'C', count: 75, percentage: 6 },
          { grade: 'Below C', count: 25, percentage: 2 }
        ]
      },
      attendance: {
        overall: 92.5,
        byGrade: [
          { grade: '9', attendance: 94.2, students: 280 },
          { grade: '10', attendance: 92.8, students: 320 },
          { grade: '11', attendance: 91.5, students: 300 },
          { grade: '12', attendance: 90.1, students: 350 }
        ],
        monthlyTrend: [
          { month: 'Jan', attendance: 93.2 },
          { month: 'Feb', attendance: 94.1 },
          { month: 'Mar', attendance: 92.8 },
          { month: 'Apr', attendance: 91.5 },
          { month: 'May', attendance: 92.5 }
        ]
      },
      atRiskStudents: [
        {
          id: 1,
          name: 'John Smith',
          grade: '10',
          riskFactors: ['Low Attendance (78%)', 'Failing Math', 'Missing Assignments'],
          riskLevel: 'high',
          gpa: 2.1,
          attendance: 78
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          grade: '11',
          riskFactors: ['Declining Grades', 'Low Attendance (82%)'],
          riskLevel: 'medium',
          gpa: 2.8,
          attendance: 82
        },
        {
          id: 3,
          name: 'Mike Davis',
          grade: '12',
          riskFactors: ['Missing Assignments', 'Low Test Scores'],
          riskLevel: 'medium',
          gpa: 2.6,
          attendance: 88
        }
      ],
      teacherEffectiveness: [
        {
          id: 1,
          name: 'Dr. Smith',
          subject: 'Mathematics',
          avgStudentGPA: 3.8,
          studentSatisfaction: 4.6,
          classAttendance: 95.2,
          effectiveness: 'excellent'
        },
        {
          id: 2,
          name: 'Prof. Johnson',
          subject: 'Physics',
          avgStudentGPA: 3.6,
          studentSatisfaction: 4.4,
          classAttendance: 93.8,
          effectiveness: 'good'
        },
        {
          id: 3,
          name: 'Ms. Davis',
          subject: 'English',
          avgStudentGPA: 3.9,
          studentSatisfaction: 4.7,
          classAttendance: 96.1,
          effectiveness: 'excellent'
        }
      ]
    }

    setAnalyticsData(mockData)
    setLoading(false)
  }, [])

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getEffectivenessColor = (effectiveness) => {
    switch (effectiveness) {
      case 'excellent': return 'bg-green-100 text-green-800'
      case 'good': return 'bg-blue-100 text-blue-800'
      case 'average': return 'bg-yellow-100 text-yellow-800'
      case 'needs-improvement': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />
      default: return <div className="w-4 h-4" />
    }
  }

  const exportReport = () => {
    toast.success('Analytics report exported successfully!')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive school performance insights</p>
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
          </select>
          <button
            onClick={exportReport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview?.totalStudents}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600">+{analyticsData.overview?.trends.students}%</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Teachers</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview?.totalTeachers}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600">+{analyticsData.overview?.trends.teachers}%</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview?.averageAttendance}%</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
            <span className="text-sm text-red-600">{analyticsData.overview?.trends.attendance}%</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall GPA</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.performance?.overallGPA}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600">+{analyticsData.overview?.trends.performance}%</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Performance Overview', icon: BarChart3 },
              { id: 'attendance', name: 'Attendance Analysis', icon: Calendar },
              { id: 'at-risk', name: 'At-Risk Students', icon: AlertTriangle },
              { id: 'teachers', name: 'Teacher Effectiveness', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Performance Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Subject Performance</h3>
                  <div className="space-y-3">
                    {analyticsData.performance?.subjectPerformance.map((subject, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="mr-3">
                            {getTrendIcon(subject.trend)}
                          </div>
                          <div>
                            <p className="font-medium">{subject.subject}</p>
                            <p className="text-sm text-gray-500">{subject.students} students</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{subject.average}</p>
                          <p className="text-sm text-gray-500">Avg GPA</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Grade Distribution</h3>
                  <div className="space-y-3">
                    {analyticsData.performance?.gradeDistribution.map((grade, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="w-8 text-sm font-medium">{grade.grade}</span>
                          <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${grade.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">{grade.count}</span>
                          <span className="text-xs text-gray-500 ml-1">({grade.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Attendance Analysis */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Attendance by Grade</h3>
                  <div className="space-y-3">
                    {analyticsData.attendance?.byGrade.map((grade, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Grade {grade.grade}</p>
                          <p className="text-sm text-gray-500">{grade.students} students</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{grade.attendance}%</p>
                          <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full ${grade.attendance >= 95 ? 'bg-green-600' : grade.attendance >= 90 ? 'bg-yellow-600' : 'bg-red-600'}`}
                              style={{ width: `${grade.attendance}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
                  <div className="space-y-3">
                    {analyticsData.attendance?.monthlyTrend.map((month, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{month.month}</span>
                        <div className="flex items-center">
                          <span className="font-semibold mr-2">{month.attendance}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${month.attendance}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* At-Risk Students */}
          {activeTab === 'at-risk' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">At-Risk Students</h3>
                <span className="text-sm text-gray-500">{analyticsData.atRiskStudents?.length} students identified</span>
              </div>
              <div className="space-y-4">
                {analyticsData.atRiskStudents?.map((student) => (
                  <div key={student.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-medium mr-3">{student.name}</h4>
                          <span className="text-sm text-gray-500">Grade {student.grade}</span>
                          <span className={`ml-3 px-2 py-1 text-xs rounded border ${getRiskLevelColor(student.riskLevel)}`}>
                            {student.riskLevel.toUpperCase()} RISK
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <span className="text-sm text-gray-500">GPA: </span>
                            <span className="font-medium">{student.gpa}</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Attendance: </span>
                            <span className="font-medium">{student.attendance}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Risk Factors:</p>
                          <div className="flex flex-wrap gap-2">
                            {student.riskFactors.map((factor, index) => (
                              <span key={index} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                                {factor}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button className="ml-4 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teacher Effectiveness */}
          {activeTab === 'teachers' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Teacher Effectiveness Metrics</h3>
              <div className="space-y-4">
                {analyticsData.teacherEffectiveness?.map((teacher) => (
                  <div key={teacher.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-medium mr-3">{teacher.name}</h4>
                          <span className="text-sm text-gray-500">{teacher.subject}</span>
                          <span className={`ml-3 px-2 py-1 text-xs rounded ${getEffectivenessColor(teacher.effectiveness)}`}>
                            {teacher.effectiveness.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Avg Student GPA</p>
                            <p className="font-semibold">{teacher.avgStudentGPA}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Student Satisfaction</p>
                            <p className="font-semibold">{teacher.studentSatisfaction}/5.0</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Class Attendance</p>
                            <p className="font-semibold">{teacher.classAttendance}%</p>
                          </div>
                        </div>
                      </div>
                      <button className="ml-4 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Analytics
