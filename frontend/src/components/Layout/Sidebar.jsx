import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { 
  Home, 
  Users, 
  BookOpen, 
  GraduationCap, 
  UserCheck, 
  Award, 
  ClipboardList, 
  MessageSquare, 
  FileText, 
  Settings, 
  LogOut, 
  Bell, 
  User, 
  Brain, 
  Download, 
  BarChart3, 
  Calendar, 
  Activity, 
  Zap 
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Sidebar logout clicked')
    
    try {
      const success = await logout()
      console.log('Sidebar logout result:', success)
      // Logout function handles redirect internally
    } catch (error) {
      console.error('Sidebar logout failed:', error)
    }
  }

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: Home }
    ]

    if (user?.role === 'super_admin') {
      return [
        ...baseItems,
        { name: 'User Management', href: '/admin/users', icon: Users },
        { name: 'Academic Years', href: '/admin/academic-years', icon: Calendar },
        { name: 'Subjects & Classes', href: '/admin/subjects', icon: BookOpen },
        { name: 'Timetable Builder', href: '/admin/timetable', icon: Zap },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        { name: 'Communications', href: '/admin/communications', icon: MessageSquare },
        { name: 'Reports', href: '/admin/reports', icon: FileText },
        { name: 'Settings', href: '/admin/settings', icon: Settings }
      ]
    }

    if (user?.role === 'teacher') {
      return [
        ...baseItems,
        { name: 'My Classes', href: '/teacher/classes', icon: GraduationCap },
        { name: 'Attendance', href: '/teacher/attendance', icon: UserCheck },
        { name: 'Grades', href: '/teacher/grades', icon: Award },
        { name: 'Assignments', href: '/teacher/assignments', icon: ClipboardList },
        { name: 'AI Assistant', href: '/teacher/ai-assistant', icon: Brain },
        { name: 'Messages', href: '/teacher/messages', icon: MessageSquare },
        { name: 'Reports', href: '/teacher/reports', icon: FileText },
        { name: 'Profile', href: '/teacher/profile', icon: Settings }
      ]
    }

    if (user?.role === 'student') {
      return [
        { name: 'Dashboard', href: '/student', icon: Home },
        { name: 'Assignments', href: '/student/assignments', icon: ClipboardList },
        { name: 'Study Boards', href: '/student/study-boards', icon: Brain },
        { name: 'Resources', href: '/student/resources', icon: Download },
        { name: 'My Grades', href: '/student/grades', icon: Award },
        { name: 'Attendance', href: '/student/attendance', icon: UserCheck },
        { name: 'Messages', href: '/student/messages', icon: MessageSquare },
        { name: 'Announcements', href: '/student/announcements', icon: Bell },
        { name: 'Profile', href: '/student/profile', icon: User }
      ]
    }

    return baseItems
  }

  const navigationItems = getNavigationItems()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="bg-primary-600 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">EduManage</span>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold">
                  {user?.firstName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onClose()
                  }
                }}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
