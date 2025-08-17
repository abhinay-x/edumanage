import React, { useState, useEffect } from 'react'
import { UserCheck, Users, Calendar, Clock, Search, Filter, CheckCircle, XCircle, AlertTriangle, Download, Send } from 'lucide-react'
import toast from 'react-hot-toast'

const TeacherAttendance = () => {
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendanceData, setAttendanceData] = useState({})
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [attendanceHistory, setAttendanceHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState('mark')
  const [bulkAction, setBulkAction] = useState('')

  useEffect(() => {
    // Mock data
    const mockClasses = [
      { id: 1, name: 'Grade 10 A - Mathematics', totalStudents: 32 },
      { id: 2, name: 'Grade 10 B - Mathematics', totalStudents: 30 },
      { id: 3, name: 'Grade 11 A - Advanced Mathematics', totalStudents: 28 }
    ]

    const mockStudents = [
      {
        id: 1,
        name: 'John Smith',
        rollNumber: '10A001',
        classId: 1,
        photo: null,
        attendanceRate: 92.5,
        recentPattern: ['present', 'present', 'absent', 'present', 'present']
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        rollNumber: '10A002',
        classId: 1,
        photo: null,
        attendanceRate: 95.8,
        recentPattern: ['present', 'present', 'present', 'present', 'present']
      },
      {
        id: 3,
        name: 'Michael Davis',
        rollNumber: '10A003',
        classId: 1,
        photo: null,
        attendanceRate: 88.3,
        recentPattern: ['present', 'absent', 'present', 'present', 'absent']
      },
      {
        id: 4,
        name: 'Emily Wilson',
        rollNumber: '10A004',
        classId: 1,
        photo: null,
        attendanceRate: 76.2,
        recentPattern: ['absent', 'present', 'absent', 'absent', 'present']
      }
    ]

    const mockAttendanceHistory = [
      {
        id: 1,
        date: '2024-03-02',
        classId: 1,
        className: 'Grade 10 A - Mathematics',
        totalStudents: 32,
        presentCount: 28,
        absentCount: 4,
        lateCount: 2,
        submittedAt: '2024-03-02T08:45:00Z'
      },
      {
        id: 2,
        date: '2024-03-01',
        classId: 1,
        className: 'Grade 10 A - Mathematics',
        totalStudents: 32,
        presentCount: 30,
        absentCount: 2,
        lateCount: 1,
        submittedAt: '2024-03-01T08:45:00Z'
      }
    ]

    setClasses(mockClasses)
    setStudents(mockStudents)
    setAttendanceHistory(mockAttendanceHistory)
    setSelectedClass('1')
    setLoading(false)

    // Initialize attendance data for today
    const todayAttendance = {}
    mockStudents.forEach(student => {
      if (student.classId === 1) {
        todayAttendance[student.id] = 'present'
      }
    })
    setAttendanceData(todayAttendance)
  }, [])

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }))
  }

  const handleBulkAction = () => {
    if (!bulkAction) return

    const classStudents = students.filter(s => s.classId === parseInt(selectedClass))
    const updatedAttendance = { ...attendanceData }
    
    classStudents.forEach(student => {
      updatedAttendance[student.id] = bulkAction
    })
    
    setAttendanceData(updatedAttendance)
    toast.success(`Marked all students as ${bulkAction}`)
    setBulkAction('')
  }

  const handleSubmitAttendance = async () => {
    try {
      const classStudents = students.filter(s => s.classId === parseInt(selectedClass))
      const presentCount = classStudents.filter(s => attendanceData[s.id] === 'present').length
      const absentCount = classStudents.filter(s => attendanceData[s.id] === 'absent').length
      const lateCount = classStudents.filter(s => attendanceData[s.id] === 'late').length

      // Add to history
      const newRecord = {
        id: Date.now(),
        date: selectedDate,
        classId: parseInt(selectedClass),
        className: classes.find(c => c.id === parseInt(selectedClass))?.name,
        totalStudents: classStudents.length,
        presentCount,
        absentCount,
        lateCount,
        submittedAt: new Date().toISOString()
      }

      setAttendanceHistory(prev => [newRecord, ...prev])
      toast.success('Attendance submitted successfully!')
      
      // Send notifications to parents of absent students
      const absentStudents = classStudents.filter(s => attendanceData[s.id] === 'absent')
      if (absentStudents.length > 0) {
        toast.success(`Notifications sent to ${absentStudents.length} parents`)
      }
    } catch (error) {
      toast.error('Failed to submit attendance')
    }
  }

  const exportAttendance = () => {
    toast.success('Attendance report exported successfully!')
  }

  const getAttendanceColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200'
      case 'absent': return 'bg-red-100 text-red-800 border-red-200'
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getAttendanceIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4" />
      case 'absent': return <XCircle className="w-4 h-4" />
      case 'late': return <Clock className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getPatternColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-500'
      case 'absent': return 'bg-red-500'
      case 'late': return 'bg-yellow-500'
      default: return 'bg-gray-300'
    }
  }

  const classStudents = students.filter(s => s.classId === parseInt(selectedClass))

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
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600">Mark and track student attendance</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setActiveView('mark')}
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeView === 'mark' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Mark Attendance
          </button>
          <button
            onClick={() => setActiveView('history')}
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeView === 'history' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            History
          </button>
          <button
            onClick={exportAttendance}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {activeView === 'mark' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bulk Action</label>
              <div className="flex space-x-2">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Action</option>
                  <option value="present">Mark All Present</option>
                  <option value="absent">Mark All Absent</option>
                </select>
                <button
                  onClick={handleBulkAction}
                  disabled={!bulkAction}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mark Attendance View */}
      {activeView === 'mark' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Mark Attendance - {classes.find(c => c.id === parseInt(selectedClass))?.name}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Total: {classStudents.length}</span>
                <span className="text-green-600">
                  Present: {classStudents.filter(s => attendanceData[s.id] === 'present').length}
                </span>
                <span className="text-red-600">
                  Absent: {classStudents.filter(s => attendanceData[s.id] === 'absent').length}
                </span>
                <span className="text-yellow-600">
                  Late: {classStudents.filter(s => attendanceData[s.id] === 'late').length}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classStudents.map((student) => (
                <div key={student.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900">{student.name}</h4>
                      <p className="text-sm text-gray-500">{student.rollNumber}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500 mr-2">Rate: {student.attendanceRate}%</span>
                        <div className="flex space-x-1">
                          {student.recentPattern.map((status, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full ${getPatternColor(status)}`}
                              title={status}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {['present', 'absent', 'late'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleAttendanceChange(student.id, status)}
                        className={`px-2 py-1 text-xs rounded border flex items-center justify-center ${
                          attendanceData[student.id] === status
                            ? getAttendanceColor(status)
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {getAttendanceIcon(status)}
                        <span className="ml-1 capitalize">{status}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleSubmitAttendance}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Attendance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance History */}
      {activeView === 'history' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Attendance History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Present
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Absent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Late
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceHistory.map((record) => {
                  const attendanceRate = ((record.presentCount + record.lateCount) / record.totalStudents * 100).toFixed(1)
                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.className}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.totalStudents}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        {record.presentCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                        {record.absentCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-medium">
                        {record.lateCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={`${parseFloat(attendanceRate) >= 85 ? 'text-green-600' : parseFloat(attendanceRate) >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {attendanceRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.submittedAt).toLocaleString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherAttendance
