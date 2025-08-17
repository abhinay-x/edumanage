import React, { useState, useEffect } from 'react'
import { Calendar, BookOpen, Award, TrendingUp, Clock, AlertCircle, CheckCircle, FileText, Bell } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const StudentHome = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [upcomingAssignments, setUpcomingAssignments] = useState([])
  const [recentGrades, setRecentGrades] = useState([])
  const [todaySchedule, setTodaySchedule] = useState([])

  // Mock data - replace with actual Firebase queries
  const stats = [
    {
      name: 'Overall GPA',
      value: '3.8',
      change: '+0.2 from last term',
      icon: Award,
      color: 'bg-green-500'
    },
    {
      name: 'Attendance',
      value: '94%',
      change: 'This month',
      icon: TrendingUp,
      color: 'bg-blue-500'
    },
    {
      name: 'Assignments',
      value: '12/15',
      change: 'Completed',
      icon: CheckCircle,
      color: 'bg-purple-500'
    },
    {
      name: 'Study Hours',
      value: '28h',
      change: 'This week',
      icon: Clock,
      color: 'bg-orange-500'
    }
  ]

  const mockAssignments = [
    {
      id: 1,
      title: 'Mathematics Quiz',
      subject: 'Mathematics',
      dueDate: '2024-08-20',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 2,
      title: 'History Essay',
      subject: 'History',
      dueDate: '2024-08-22',
      status: 'in_progress',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Science Lab Report',
      subject: 'Physics',
      dueDate: '2024-08-25',
      status: 'pending',
      priority: 'low'
    }
  ]

  const mockGrades = [
    {
      id: 1,
      subject: 'Mathematics',
      assignment: 'Algebra Test',
      grade: 'A-',
      points: '92/100',
      date: '2024-08-15'
    },
    {
      id: 2,
      subject: 'English',
      assignment: 'Essay Writing',
      grade: 'B+',
      points: '87/100',
      date: '2024-08-14'
    },
    {
      id: 3,
      subject: 'Physics',
      assignment: 'Lab Experiment',
      grade: 'A',
      points: '95/100',
      date: '2024-08-12'
    }
  ]

  const mockSchedule = [
    {
      id: 1,
      subject: 'Mathematics',
      teacher: 'Mr. Johnson',
      time: '09:00 - 10:00',
      room: 'Room 101'
    },
    {
      id: 2,
      subject: 'English',
      teacher: 'Ms. Smith',
      time: '10:30 - 11:30',
      room: 'Room 205'
    },
    {
      id: 3,
      subject: 'Physics',
      teacher: 'Dr. Brown',
      time: '14:00 - 15:00',
      room: 'Lab 2'
    }
  ]

  useEffect(() => {
    setUpcomingAssignments(mockAssignments)
    setRecentGrades(mockGrades)
    setTodaySchedule(mockSchedule)
  }, [])

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600'
    if (grade.startsWith('B')) return 'text-blue-600'
    if (grade.startsWith('C')) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName || 'Student'}!
        </h1>
        <p className="text-blue-100">
          Ready to learn and achieve your goals? Here's your academic overview.
        </p>
      </div>

      {/* Recent Announcements */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <Bell className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="ml-3 flex-1">
            <h4 className="text-sm font-medium text-yellow-800">Latest Announcement</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Mid-term exam schedule has been released. Check your timetable and prepare accordingly.
            </p>
            <button 
              onClick={() => navigate('/student/announcements')}
              className="text-sm text-yellow-800 font-medium hover:text-yellow-900 mt-2"
            >
              View all announcements →
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Assignments */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Upcoming Assignments
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingAssignments.map((assignment) => (
                <div key={assignment.id} className={`p-4 rounded-lg border-2 ${getPriorityColor(assignment.priority)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                      <p className="text-sm text-gray-600">{assignment.subject}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        assignment.status === 'pending' ? 'bg-red-100 text-red-800' :
                        assignment.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {assignment.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500 mt-1 capitalize">
                        {assignment.priority} priority
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/student/assignments')}
              className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all assignments
            </button>
          </div>
        </div>

        {/* Recent Grades */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Recent Grades
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentGrades.map((grade) => (
                <div key={grade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{grade.assignment}</h4>
                    <p className="text-sm text-gray-600">{grade.subject}</p>
                    <p className="text-xs text-gray-500">{new Date(grade.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getGradeColor(grade.grade)}`}>
                      {grade.grade}
                    </div>
                    <div className="text-sm text-gray-500">{grade.points}</div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/student/grades')}
              className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all grades
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Today's Classes
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {todaySchedule.map((class_) => (
                <div key={class_.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{class_.subject}</h4>
                      <p className="text-sm text-gray-600">{class_.teacher}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {class_.time}
                        <span className="mx-2">•</span>
                        {class_.room}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/student/assignments')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                <FileText className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Submit Assignment</p>
              </button>
              <button 
                onClick={() => navigate('/student/resources')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                <BookOpen className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Study Resources</p>
              </button>
              <button 
                onClick={() => navigate('/student/grades')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                <Award className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">View Grades</p>
              </button>
              <button 
                onClick={() => navigate('/student/attendance')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                <Calendar className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Attendance</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Study Reminder */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">Study Tip</h4>
            <p className="text-sm text-blue-700 mt-1">
              You have 3 assignments due this week. Consider creating a study schedule to manage your time effectively.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentHome
