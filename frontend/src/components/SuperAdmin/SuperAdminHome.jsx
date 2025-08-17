import React, { useState, useEffect } from 'react'
import { Users, BookOpen, Calendar, TrendingUp, UserCheck, Award, MessageSquare, AlertTriangle } from 'lucide-react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../config/firebase'

const SuperAdminHome = () => {
  const [stats, setStats] = useState([
    {
      name: 'Total Students',
      value: '0',
      change: '+0%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Teachers',
      value: '0',
      change: '+0%',
      changeType: 'increase',
      icon: UserCheck,
      color: 'bg-green-500'
    },
    {
      name: 'Active Classes',
      value: '0',
      change: '+0%',
      changeType: 'increase',
      icon: BookOpen,
      color: 'bg-purple-500'
    },
    {
      name: 'Attendance Rate',
      value: '0%',
      change: '+0%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users by role
        const usersRef = collection(db, 'users')
        const usersSnapshot = await getDocs(usersRef)
        
        let studentCount = 0
        let teacherCount = 0
        
        usersSnapshot.forEach((doc) => {
          const userData = doc.data()
          if (userData.role === 'student') studentCount++
          if (userData.role === 'teacher') teacherCount++
        })

        // Fetch classes
        const classesRef = collection(db, 'classes')
        const classesSnapshot = await getDocs(classesRef)
        const classCount = classesSnapshot.size

        // Fetch attendance for rate calculation
        const attendanceRef = collection(db, 'attendance')
        const attendanceSnapshot = await getDocs(attendanceRef)
        
        let presentCount = 0
        let totalAttendance = attendanceSnapshot.size
        
        attendanceSnapshot.forEach((doc) => {
          const attendanceData = doc.data()
          if (attendanceData.status === 'present') presentCount++
        })
        
        const attendanceRate = totalAttendance > 0 ? ((presentCount / totalAttendance) * 100).toFixed(1) : 0

        setStats([
          {
            name: 'Total Students',
            value: studentCount.toString(),
            change: '+0%',
            changeType: 'increase',
            icon: Users,
            color: 'bg-blue-500'
          },
          {
            name: 'Total Teachers',
            value: teacherCount.toString(),
            change: '+0%',
            changeType: 'increase',
            icon: UserCheck,
            color: 'bg-green-500'
          },
          {
            name: 'Active Classes',
            value: classCount.toString(),
            change: '+0%',
            changeType: 'increase',
            icon: BookOpen,
            color: 'bg-purple-500'
          },
          {
            name: 'Attendance Rate',
            value: `${attendanceRate}%`,
            change: '+0%',
            changeType: 'increase',
            icon: TrendingUp,
            color: 'bg-orange-500'
          }
        ])
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [])

  const recentActivities = [
    {
      id: 1,
      type: 'user_created',
      message: 'New teacher account created for John Smith',
      time: '2 hours ago',
      icon: Users
    },
    {
      id: 2,
      type: 'class_created',
      message: 'Mathematics class added for Grade 10-A',
      time: '4 hours ago',
      icon: BookOpen
    },
    {
      id: 3,
      type: 'attendance',
      message: 'Daily attendance recorded for all classes',
      time: '6 hours ago',
      icon: UserCheck
    },
    {
      id: 4,
      type: 'grade_updated',
      message: 'Grades updated for Chemistry - Grade 11',
      time: '8 hours ago',
      icon: Award
    }
  ]

  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Low attendance in Grade 9-B (78%)',
      priority: 'medium'
    },
    {
      id: 2,
      type: 'info',
      message: 'Parent-teacher meeting scheduled for next week',
      priority: 'low'
    },
    {
      id: 3,
      type: 'urgent',
      message: '5 teachers pending profile completion',
      priority: 'high'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening at your institution.</p>
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
                <p className={`text-sm ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <activity.icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all activities
            </button>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                  alert.priority === 'high' ? 'border-red-500 bg-red-50' :
                  alert.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}>
                  <div className="flex items-start">
                    <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                      alert.priority === 'high' ? 'text-red-500' :
                      alert.priority === 'medium' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`} />
                    <div className="ml-2">
                      <p className="text-sm text-gray-900">{alert.message}</p>
                      <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                        alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                        alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.priority} priority
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all alerts
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="w-6 h-6 text-primary-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Add User</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <BookOpen className="w-6 h-6 text-primary-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Create Class</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="w-6 h-6 text-primary-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Schedule Event</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <MessageSquare className="w-6 h-6 text-primary-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Send Announcement</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminHome
