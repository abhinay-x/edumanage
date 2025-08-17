import React, { useState, useEffect } from 'react'
import { UserCheck, Calendar, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const StudentAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([])
  const [selectedMonth, setSelectedMonth] = useState('current')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock attendance data
    const mockAttendance = [
      {
        id: 1,
        subject: 'Mathematics',
        teacher: 'Dr. Smith',
        totalClasses: 20,
        attended: 18,
        percentage: 90,
        recentRecords: [
          { date: '2024-02-20', status: 'present', time: '09:00 AM' },
          { date: '2024-02-18', status: 'present', time: '09:00 AM' },
          { date: '2024-02-15', status: 'absent', time: '09:00 AM' },
          { date: '2024-02-13', status: 'present', time: '09:00 AM' },
          { date: '2024-02-11', status: 'late', time: '09:15 AM' }
        ]
      },
      {
        id: 2,
        subject: 'Physics',
        teacher: 'Prof. Johnson',
        totalClasses: 18,
        attended: 17,
        percentage: 94,
        recentRecords: [
          { date: '2024-02-19', status: 'present', time: '11:00 AM' },
          { date: '2024-02-17', status: 'present', time: '11:00 AM' },
          { date: '2024-02-14', status: 'present', time: '11:00 AM' },
          { date: '2024-02-12', status: 'present', time: '11:00 AM' },
          { date: '2024-02-10', status: 'absent', time: '11:00 AM' }
        ]
      },
      {
        id: 3,
        subject: 'Chemistry',
        teacher: 'Dr. Williams',
        totalClasses: 16,
        attended: 15,
        percentage: 94,
        recentRecords: [
          { date: '2024-02-21', status: 'present', time: '02:00 PM' },
          { date: '2024-02-19', status: 'present', time: '02:00 PM' },
          { date: '2024-02-16', status: 'present', time: '02:00 PM' },
          { date: '2024-02-14', status: 'late', time: '02:10 PM' },
          { date: '2024-02-12', status: 'present', time: '02:00 PM' }
        ]
      },
      {
        id: 4,
        subject: 'English Literature',
        teacher: 'Ms. Davis',
        totalClasses: 15,
        attended: 13,
        percentage: 87,
        recentRecords: [
          { date: '2024-02-20', status: 'present', time: '03:30 PM' },
          { date: '2024-02-18', status: 'absent', time: '03:30 PM' },
          { date: '2024-02-15', status: 'present', time: '03:30 PM' },
          { date: '2024-02-13', status: 'absent', time: '03:30 PM' },
          { date: '2024-02-11', status: 'present', time: '03:30 PM' }
        ]
      }
    ]

    setAttendanceData(mockAttendance)
    setLoading(false)
  }, [])

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50'
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'absent':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'late':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'text-green-600 bg-green-50'
      case 'absent':
        return 'text-red-600 bg-red-50'
      case 'late':
        return 'text-yellow-600 bg-yellow-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const calculateOverallAttendance = () => {
    const totalClasses = attendanceData.reduce((sum, subject) => sum + subject.totalClasses, 0)
    const totalAttended = attendanceData.reduce((sum, subject) => sum + subject.attended, 0)
    return totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0
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
          <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
          <p className="text-gray-600">Track your attendance record and patterns</p>
        </div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="current">Current Month</option>
          <option value="previous">Previous Month</option>
          <option value="semester">This Semester</option>
        </select>
      </div>

      {/* Attendance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overall Attendance</p>
              <p className="text-2xl font-bold text-gray-900">{calculateOverallAttendance()}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Classes This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {attendanceData.reduce((sum, subject) => sum + subject.totalClasses, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Attendance Streak</p>
              <p className="text-2xl font-bold text-gray-900">5 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-wise Attendance */}
      <div className="space-y-6">
        {attendanceData.map((subject) => (
          <div key={subject.id} className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{subject.subject}</h3>
                  <p className="text-sm text-gray-500">Instructor: {subject.teacher}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAttendanceColor(subject.percentage)}`}>
                    {subject.percentage}%
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    {subject.attended}/{subject.totalClasses} classes
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Recent Attendance</h4>
              <div className="space-y-3">
                {subject.recentRecords.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex items-center mr-3">
                        {getStatusIcon(record.status)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{record.date}</p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {record.time}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Attendance Alert */}
      {calculateOverallAttendance() < 75 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-red-800">Low Attendance Warning</h4>
              <p className="text-sm text-red-700 mt-1">
                Your attendance is below the required 75% minimum. Please ensure regular attendance to avoid academic penalties.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentAttendance
