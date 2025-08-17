import React, { useState, useEffect } from 'react'
import { Zap, Calendar, Clock, Users, BookOpen, AlertTriangle, Download, RefreshCw, Save, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

const TimetableBuilder = () => {
  const [activeView, setActiveView] = useState('builder')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedWeek, setSelectedWeek] = useState('current')
  const [timetableData, setTimetableData] = useState({})
  const [conflicts, setConflicts] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [loading, setLoading] = useState(true)

  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [rooms, setRooms] = useState([])

  const timeSlots = [
    '08:00-08:45', '08:45-09:30', '09:30-10:15', '10:15-11:00',
    '11:15-12:00', '12:00-12:45', '13:30-14:15', '14:15-15:00'
  ]

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  useEffect(() => {
    // Mock data initialization
    const mockClasses = [
      { id: 1, name: 'Grade 10 A', students: 32 },
      { id: 2, name: 'Grade 10 B', students: 30 },
      { id: 3, name: 'Grade 11 A', students: 28 },
      { id: 4, name: 'Grade 11 B', students: 26 },
      { id: 5, name: 'Grade 12 A', students: 25 }
    ]

    const mockSubjects = [
      { id: 1, name: 'Mathematics', code: 'MATH', periodsPerWeek: 6 },
      { id: 2, name: 'Physics', code: 'PHY', periodsPerWeek: 5 },
      { id: 3, name: 'Chemistry', code: 'CHEM', periodsPerWeek: 4 },
      { id: 4, name: 'Biology', code: 'BIO', periodsPerWeek: 4 },
      { id: 5, name: 'English', code: 'ENG', periodsPerWeek: 5 },
      { id: 6, name: 'History', code: 'HIST', periodsPerWeek: 3 },
      { id: 7, name: 'Geography', code: 'GEO', periodsPerWeek: 3 }
    ]

    const mockTeachers = [
      { id: 1, name: 'Dr. Smith', subjects: ['Mathematics'], availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
      { id: 2, name: 'Prof. Johnson', subjects: ['Physics'], availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
      { id: 3, name: 'Dr. Wilson', subjects: ['Chemistry'], availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'] },
      { id: 4, name: 'Ms. Davis', subjects: ['English'], availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
      { id: 5, name: 'Mr. Brown', subjects: ['Biology'], availability: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'] }
    ]

    const mockRooms = [
      { id: 1, name: 'Room 101', type: 'Regular', capacity: 35 },
      { id: 2, name: 'Lab A', type: 'Science Lab', capacity: 30 },
      { id: 3, name: 'Lab B', type: 'Computer Lab', capacity: 25 },
      { id: 4, name: 'Room 201', type: 'Regular', capacity: 40 },
      { id: 5, name: 'Auditorium', type: 'Large Hall', capacity: 100 }
    ]

    // Sample timetable data
    const mockTimetable = {
      'Grade 10 A': {
        'Monday': {
          '08:00-08:45': { subject: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 101' },
          '08:45-09:30': { subject: 'Physics', teacher: 'Prof. Johnson', room: 'Lab A' },
          '09:30-10:15': { subject: 'English', teacher: 'Ms. Davis', room: 'Room 101' },
          '10:15-11:00': { subject: 'Chemistry', teacher: 'Dr. Wilson', room: 'Lab B' },
          '11:15-12:00': { subject: 'Biology', teacher: 'Mr. Brown', room: 'Lab A' },
          '12:00-12:45': { subject: 'History', teacher: 'Dr. Thompson', room: 'Room 101' },
          '13:30-14:15': { subject: 'Geography', teacher: 'Ms. Anderson', room: 'Room 101' },
          '14:15-15:00': { subject: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 101' }
        },
        'Tuesday': {
          '08:00-08:45': { subject: 'Physics', teacher: 'Prof. Johnson', room: 'Lab A' },
          '08:45-09:30': { subject: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 101' },
          '09:30-10:15': { subject: 'Chemistry', teacher: 'Dr. Wilson', room: 'Lab B' },
          '10:15-11:00': { subject: 'English', teacher: 'Ms. Davis', room: 'Room 101' },
          '11:15-12:00': { subject: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 101' },
          '12:00-12:45': { subject: 'Biology', teacher: 'Mr. Brown', room: 'Lab A' },
          '13:30-14:15': { subject: 'History', teacher: 'Dr. Thompson', room: 'Room 101' },
          '14:15-15:00': { subject: 'Geography', teacher: 'Ms. Anderson', room: 'Room 101' }
        }
        // Add more days as needed
      }
    }

    setClasses(mockClasses)
    setSubjects(mockSubjects)
    setTeachers(mockTeachers)
    setRooms(mockRooms)
    setTimetableData(mockTimetable)
    setSelectedClass('Grade 10 A')
    setLoading(false)
  }, [])

  const generateAITimetable = async () => {
    setIsGenerating(true)
    setConflicts([])
    
    try {
      // Simulate AI generation process
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock conflict detection
      const mockConflicts = [
        {
          type: 'teacher',
          message: 'Dr. Smith has overlapping classes on Monday 08:00-08:45',
          severity: 'high',
          suggestions: ['Move Grade 10 B Math to 09:30-10:15', 'Assign different teacher']
        },
        {
          type: 'room',
          message: 'Lab A is double-booked on Tuesday 10:15-11:00',
          severity: 'medium',
          suggestions: ['Use Lab B instead', 'Reschedule one class']
        }
      ]
      
      setConflicts(mockConflicts)
      toast.success('AI timetable generated successfully!')
      
      if (mockConflicts.length > 0) {
        toast.warning(`${mockConflicts.length} conflicts detected. Please review.`)
      }
      
    } catch (error) {
      toast.error('Failed to generate timetable')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCellEdit = (day, timeSlot, field, value) => {
    setTimetableData(prev => ({
      ...prev,
      [selectedClass]: {
        ...prev[selectedClass],
        [day]: {
          ...prev[selectedClass]?.[day],
          [timeSlot]: {
            ...prev[selectedClass]?.[day]?.[timeSlot],
            [field]: value
          }
        }
      }
    }))
  }

  const saveTimetable = async () => {
    try {
      // Save timetable logic here
      toast.success('Timetable saved successfully!')
    } catch (error) {
      toast.error('Failed to save timetable')
    }
  }

  const exportTimetable = () => {
    // Export functionality
    toast.success('Timetable exported successfully!')
  }

  const getConflictColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800'
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      case 'low': return 'bg-blue-100 border-blue-300 text-blue-800'
      default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Dynamic Timetable Builder</h1>
          <p className="text-gray-600">AI-assisted scheduling with conflict detection</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={generateAITimetable}
            disabled={isGenerating}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            {isGenerating ? 'Generating...' : 'AI Generate'}
          </button>
          <button
            onClick={saveTimetable}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </button>
          <button
            onClick={exportTimetable}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.name}>{cls.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Week</label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="current">Current Week</option>
              <option value="next">Next Week</option>
              <option value="template">Template</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
            <select
              value={activeView}
              onChange={(e) => setActiveView(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="builder">Timetable Builder</option>
              <option value="conflicts">Conflict Analysis</option>
              <option value="resources">Resource Utilization</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            <h3 className="text-sm font-medium text-yellow-800">
              {conflicts.length} Conflict{conflicts.length > 1 ? 's' : ''} Detected
            </h3>
          </div>
          <div className="space-y-2">
            {conflicts.slice(0, 3).map((conflict, index) => (
              <div key={index} className={`p-2 rounded border ${getConflictColor(conflict.severity)}`}>
                <p className="text-sm font-medium">{conflict.message}</p>
                <p className="text-xs mt-1">
                  Suggestions: {conflict.suggestions.join(', ')}
                </p>
              </div>
            ))}
            {conflicts.length > 3 && (
              <p className="text-sm text-yellow-700">
                +{conflicts.length - 3} more conflicts. Switch to Conflict Analysis view for details.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      {activeView === 'builder' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  {weekDays.map((day) => (
                    <th key={day} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeSlots.map((timeSlot) => (
                  <tr key={timeSlot}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {timeSlot}
                    </td>
                    {weekDays.map((day) => {
                      const cellData = timetableData[selectedClass]?.[day]?.[timeSlot]
                      return (
                        <td key={day} className="px-6 py-4 whitespace-nowrap">
                          {cellData ? (
                            <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs">
                              <div className="font-medium text-blue-900">{cellData.subject}</div>
                              <div className="text-blue-700">{cellData.teacher}</div>
                              <div className="text-blue-600">{cellData.room}</div>
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

      {activeView === 'conflicts' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Conflict Analysis</h3>
          {conflicts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-500">No conflicts detected in current timetable</p>
            </div>
          ) : (
            <div className="space-y-4">
              {conflicts.map((conflict, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getConflictColor(conflict.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium capitalize">{conflict.type} Conflict</h4>
                      <p className="mt-1">{conflict.message}</p>
                      <div className="mt-2">
                        <p className="text-sm font-medium">Suggested Solutions:</p>
                        <ul className="list-disc list-inside text-sm mt-1">
                          {conflict.suggestions.map((suggestion, idx) => (
                            <li key={idx}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs rounded capitalize">
                      {conflict.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeView === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Teacher Utilization</h3>
            <div className="space-y-3">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{teacher.name}</p>
                    <p className="text-sm text-gray-500">{teacher.subjects.join(', ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">85%</p>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Room Utilization</h3>
            <div className="space-y-3">
              {rooms.map((room) => (
                <div key={room.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{room.name}</p>
                    <p className="text-sm text-gray-500">{room.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">72%</p>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
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

export default TimetableBuilder
