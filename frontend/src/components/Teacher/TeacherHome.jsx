import React, { useState, useEffect } from 'react'
import { Calendar, Users, BookOpen, Clock, TrendingUp, CheckCircle, AlertTriangle, Bell } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const TeacherHome = () => {
  const { user } = useAuth()
  const [todaySchedule, setTodaySchedule] = useState([])
  const [upcomingAssignments, setUpcomingAssignments] = useState([])
  const [recentActivity, setRecentActivity] = useState([])

  // Mock data - replace with actual Firebase queries
  const stats = [
    {
      name: 'My Classes',
      value: '5',
      change: 'Active',
      icon: BookOpen,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Students',
      value: '142',
      change: 'Enrolled',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      name: 'Pending Grades',
      value: '23',
      change: 'To Review',
      icon: CheckCircle,
      color: 'bg-orange-500'
    },
    {
      name: 'Attendance Rate',
      value: '92%',
      change: 'This Week',
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ]

  const mockSchedule = [
    {
      id: 1,
      subject: 'Mathematics',
      class: 'Grade 10-A',
      time: '09:00 - 10:00',
      room: 'Room 101',
      status: 'upcoming'
    },
    {
      id: 2,
      subject: 'Physics',
      class: 'Grade 11-B',
      time: '10:30 - 11:30',
      room: 'Lab 2',
      status: 'current'
    },
    {
      id: 3,
      subject: 'Mathematics',
      class: 'Grade 9-C',
      time: '14:00 - 15:00',
      room: 'Room 101',
      status: 'upcoming'
    }
  ]

  const mockAssignments = [
    {
      id: 1,
      title: 'Algebra Quiz',
      class: 'Grade 10-A',
      dueDate: '2024-08-20',
      submissions: 28,
      total: 30
    },
    {
      id: 2,
      title: 'Physics Lab Report',
      class: 'Grade 11-B',
      dueDate: '2024-08-22',
      submissions: 15,
      total: 25
    }
  ]

  const mockActivity = [
    {
      id: 1,
      type: 'grade',
      message: 'Graded Mathematics Quiz for Grade 10-A',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'attendance',
      message: 'Marked attendance for Physics - Grade 11-B',
      time: '4 hours ago'
    },
    {
      id: 3,
      type: 'assignment',
      message: 'Created new assignment: Chemistry Lab Report',
      time: '1 day ago'
    }
  ]

  useEffect(() => {
    setTodaySchedule(mockSchedule)
    setUpcomingAssignments(mockAssignments)
    setRecentActivity(mockActivity)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'current':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-primary-100">
          Ready to inspire and educate? Here's your overview for today.
        </p>
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
        {/* Today's Schedule */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Today's Schedule
              </h3>
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {todaySchedule.map((class_) => (
                <div key={class_.id} className={`p-4 rounded-lg border-2 ${getStatusColor(class_.status)}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{class_.subject}</h4>
                      <p className="text-sm text-gray-600">{class_.class}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {class_.time}
                        <span className="mx-2">•</span>
                        {class_.room}
                      </div>
                    </div>
                    {class_.status === 'current' && (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                        Now
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {todaySchedule.length === 0 && (
              <p className="text-center text-gray-500 py-8">No classes scheduled for today</p>
            )}
          </div>
        </div>

        {/* Upcoming Assignments */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Assignment Status
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingAssignments.map((assignment) => (
                <div key={assignment.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                      <p className="text-sm text-gray-600">{assignment.class}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <span>{assignment.submissions}/{assignment.total} submitted</span>
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${(assignment.submissions / assignment.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {upcomingAssignments.length === 0 && (
              <p className="text-center text-gray-500 py-8">No pending assignments</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    {activity.type === 'grade' && <CheckCircle className="w-4 h-4 text-primary-600" />}
                    {activity.type === 'attendance' && <Users className="w-4 h-4 text-primary-600" />}
                    {activity.type === 'assignment' && <BookOpen className="w-4 h-4 text-primary-600" />}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
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
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                <Users className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Mark Attendance</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                <CheckCircle className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Grade Assignments</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                <BookOpen className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Create Assignment</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                <Bell className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Send Message</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-yellow-800">Reminder</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Parent-teacher conference is scheduled for next week. Please prepare progress reports for all students.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherHome
