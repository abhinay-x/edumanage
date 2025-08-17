import React, { useState, useEffect } from 'react'
import { GraduationCap, Users, Calendar, Clock, BookOpen, Search, Filter, Eye, BarChart3, UserCheck } from 'lucide-react'
import toast from 'react-hot-toast'

const TeacherClasses = () => {
  const [selectedClass, setSelectedClass] = useState(null)
  const [activeView, setActiveView] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState([])
  const [schedule, setSchedule] = useState([])
  const [students, setStudents] = useState([])

  useEffect(() => {
    // Mock data for teacher's assigned classes
    const mockClasses = [
      {
        id: 1,
        name: 'Grade 10 A - Mathematics',
        subject: 'Mathematics',
        grade: '10',
        section: 'A',
        totalStudents: 32,
        presentStudents: 28,
        room: 'Room 101',
        schedule: [
          { day: 'Monday', time: '08:00-08:45' },
          { day: 'Wednesday', time: '09:30-10:15' },
          { day: 'Friday', time: '11:15-12:00' }
        ],
        averageGrade: 3.4,
        attendanceRate: 87.5
      },
      {
        id: 2,
        name: 'Grade 10 B - Mathematics',
        subject: 'Mathematics',
        grade: '10',
        section: 'B',
        totalStudents: 30,
        presentStudents: 26,
        room: 'Room 102',
        schedule: [
          { day: 'Tuesday', time: '08:00-08:45' },
          { day: 'Thursday', time: '10:15-11:00' },
          { day: 'Friday', time: '13:30-14:15' }
        ],
        averageGrade: 3.2,
        attendanceRate: 86.7
      },
      {
        id: 3,
        name: 'Grade 11 A - Advanced Mathematics',
        subject: 'Advanced Mathematics',
        grade: '11',
        section: 'A',
        totalStudents: 28,
        presentStudents: 25,
        room: 'Room 103',
        schedule: [
          { day: 'Monday', time: '10:15-11:00' },
          { day: 'Wednesday', time: '13:30-14:15' },
          { day: 'Thursday', time: '08:00-08:45' }
        ],
        averageGrade: 3.6,
        attendanceRate: 89.3
      }
    ]

    const mockSchedule = [
      {
        id: 1,
        day: 'Monday',
        slots: [
          { time: '08:00-08:45', class: 'Grade 10 A - Mathematics', room: 'Room 101', status: 'scheduled' },
          { time: '10:15-11:00', class: 'Grade 11 A - Advanced Mathematics', room: 'Room 103', status: 'scheduled' }
        ]
      },
      {
        id: 2,
        day: 'Tuesday',
        slots: [
          { time: '08:00-08:45', class: 'Grade 10 B - Mathematics', room: 'Room 102', status: 'scheduled' }
        ]
      },
      {
        id: 3,
        day: 'Wednesday',
        slots: [
          { time: '09:30-10:15', class: 'Grade 10 A - Mathematics', room: 'Room 101', status: 'scheduled' },
          { time: '13:30-14:15', class: 'Grade 11 A - Advanced Mathematics', room: 'Room 103', status: 'scheduled' }
        ]
      },
      {
        id: 4,
        day: 'Thursday',
        slots: [
          { time: '08:00-08:45', class: 'Grade 11 A - Advanced Mathematics', room: 'Room 103', status: 'scheduled' },
          { time: '10:15-11:00', class: 'Grade 10 B - Mathematics', room: 'Room 102', status: 'scheduled' }
        ]
      },
      {
        id: 5,
        day: 'Friday',
        slots: [
          { time: '11:15-12:00', class: 'Grade 10 A - Mathematics', room: 'Room 101', status: 'scheduled' },
          { time: '13:30-14:15', class: 'Grade 10 B - Mathematics', room: 'Room 102', status: 'scheduled' }
        ]
      }
    ]

    const mockStudents = [
      {
        id: 1,
        name: 'John Smith',
        rollNumber: '10A001',
        email: 'john.smith@student.edu',
        phone: '+1 (555) 123-4567',
        parentName: 'Robert Smith',
        parentPhone: '+1 (555) 123-4568',
        currentGrade: 'B+',
        attendanceRate: 92.5,
        lastAttendance: '2024-03-02',
        photo: null,
        classId: 1
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        rollNumber: '10A002',
        email: 'sarah.johnson@student.edu',
        phone: '+1 (555) 234-5678',
        parentName: 'Mary Johnson',
        parentPhone: '+1 (555) 234-5679',
        currentGrade: 'A-',
        attendanceRate: 95.8,
        lastAttendance: '2024-03-02',
        photo: null,
        classId: 1
      },
      {
        id: 3,
        name: 'Michael Davis',
        rollNumber: '10A003',
        email: 'michael.davis@student.edu',
        phone: '+1 (555) 345-6789',
        parentName: 'David Davis',
        parentPhone: '+1 (555) 345-6790',
        currentGrade: 'B',
        attendanceRate: 88.3,
        lastAttendance: '2024-03-01',
        photo: null,
        classId: 1
      }
    ]

    setClasses(mockClasses)
    setSchedule(mockSchedule)
    setStudents(mockStudents)
    setLoading(false)
  }, [])

  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem)
    setActiveView('students')
  }

  const getClassStudents = (classId) => {
    return students.filter(student => student.classId === classId)
  }

  const getGradeColor = (grade) => {
    switch (grade.charAt(0)) {
      case 'A': return 'bg-green-100 text-green-800'
      case 'B': return 'bg-blue-100 text-blue-800'
      case 'C': return 'bg-yellow-100 text-yellow-800'
      case 'D': return 'bg-orange-100 text-orange-800'
      case 'F': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAttendanceColor = (rate) => {
    if (rate >= 95) return 'text-green-600'
    if (rate >= 85) return 'text-blue-600'
    if (rate >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const filteredStudents = selectedClass 
    ? getClassStudents(selectedClass.id).filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

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
          <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
          <p className="text-gray-600">Manage your assigned classes and students</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setActiveView('overview')}
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeView === 'overview' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            Classes
          </button>
          <button
            onClick={() => setActiveView('schedule')}
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeView === 'schedule' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </button>
        </div>
      </div>

      {/* Classes Overview */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <div key={classItem.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{classItem.name}</h3>
                  <p className="text-sm text-gray-500">Room: {classItem.room}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {classItem.subject}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Students:</span>
                  <span className="font-medium">{classItem.totalStudents}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Present Today:</span>
                  <span className="font-medium text-green-600">{classItem.presentStudents}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Grade:</span>
                  <span className="font-medium">{classItem.averageGrade}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Attendance Rate:</span>
                  <span className={`font-medium ${getAttendanceColor(classItem.attendanceRate)}`}>
                    {classItem.attendanceRate}%
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Weekly Schedule:</p>
                <div className="space-y-1">
                  {classItem.schedule.map((slot, index) => (
                    <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                      {slot.day}: {slot.time}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleClassSelect(classItem)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
                >
                  <Users className="w-4 h-4 mr-1" />
                  View Students
                </button>
                <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule View */}
      {activeView === 'schedule' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Schedule</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  {schedule.map((day) => (
                    <th key={day.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {day.day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {['08:00-08:45', '09:30-10:15', '10:15-11:00', '11:15-12:00', '13:30-14:15'].map((timeSlot) => (
                  <tr key={timeSlot}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {timeSlot}
                    </td>
                    {schedule.map((day) => {
                      const slot = day.slots.find(s => s.time === timeSlot)
                      return (
                        <td key={day.id} className="px-6 py-4 whitespace-nowrap">
                          {slot ? (
                            <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs">
                              <div className="font-medium text-blue-900">{slot.class}</div>
                              <div className="text-blue-700">{slot.room}</div>
                            </div>
                          ) : (
                            <div className="bg-gray-50 border border-gray-200 rounded p-2 text-xs text-gray-500 text-center">
                              Free
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student List View */}
      {activeView === 'students' && selectedClass && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedClass.name}</h3>
                <p className="text-gray-600">Student Roster</p>
              </div>
              <button
                onClick={() => setActiveView('overview')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Back to Classes
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{student.name}</h4>
                      <p className="text-sm text-gray-500">{student.rollNumber}</p>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getGradeColor(student.currentGrade)}`}>
                          {student.currentGrade}
                        </span>
                        <span className={`text-xs font-medium ${getAttendanceColor(student.attendanceRate)}`}>
                          {student.attendanceRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    <p>Parent: {student.parentName}</p>
                    <p>Last Attendance: {student.lastAttendance}</p>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button className="flex-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                      View Profile
                    </button>
                    <button className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded hover:bg-gray-100">
                      <UserCheck className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherClasses
