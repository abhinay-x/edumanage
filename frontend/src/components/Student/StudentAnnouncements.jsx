import React, { useState, useEffect } from 'react'
import { Bell, Calendar, User, Pin, Eye, Filter, Search } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const StudentAnnouncements = () => {
  const { user } = useAuth()
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, unread, important
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchAnnouncements()
  }, [user])

  const fetchAnnouncements = async () => {
    try {
      // Mock data for demonstration - replace with actual Firebase query
      const mockAnnouncements = [
        {
          id: '1',
          title: 'Mid-Term Exam Schedule Released',
          content: 'The mid-term examination schedule has been released. Please check your timetable and prepare accordingly. Exams will start from March 15th.',
          author: 'Academic Office',
          authorRole: 'Administration',
          createdAt: new Date('2024-01-20'),
          priority: 'high',
          category: 'Academic',
          isRead: false,
          isPinned: true,
          attachments: ['exam_schedule.pdf']
        },
        {
          id: '2',
          title: 'Library Hours Extended',
          content: 'Due to upcoming exams, library hours have been extended. The library will now be open from 7:00 AM to 10:00 PM on weekdays.',
          author: 'Library Staff',
          authorRole: 'Staff',
          createdAt: new Date('2024-01-18'),
          priority: 'medium',
          category: 'General',
          isRead: true,
          isPinned: false,
          attachments: []
        },
        {
          id: '3',
          title: 'Science Fair Registration Open',
          content: 'Registration for the annual science fair is now open. Students can register their projects until February 1st. Prizes will be awarded to top 3 projects.',
          author: 'Dr. Johnson',
          authorRole: 'Teacher',
          createdAt: new Date('2024-01-15'),
          priority: 'medium',
          category: 'Events',
          isRead: false,
          isPinned: false,
          attachments: ['science_fair_guidelines.pdf']
        },
        {
          id: '4',
          title: 'Holiday Notice - Republic Day',
          content: 'The school will remain closed on January 26th in observance of Republic Day. Regular classes will resume on January 27th.',
          author: 'Principal Office',
          authorRole: 'Administration',
          createdAt: new Date('2024-01-12'),
          priority: 'low',
          category: 'Holiday',
          isRead: true,
          isPinned: false,
          attachments: []
        }
      ]
      setAnnouncements(mockAnnouncements)
    } catch (error) {
      console.error('Error fetching announcements:', error)
      toast.error('Failed to load announcements')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (announcementId) => {
    try {
      const updatedAnnouncements = announcements.map(announcement =>
        announcement.id === announcementId
          ? { ...announcement, isRead: true }
          : announcement
      )
      setAnnouncements(updatedAnnouncements)
    } catch (error) {
      console.error('Error marking announcement as read:', error)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50'
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'low':
        return 'border-l-green-500 bg-green-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Academic':
        return 'bg-blue-100 text-blue-800'
      case 'Events':
        return 'bg-purple-100 text-purple-800'
      case 'Holiday':
        return 'bg-green-100 text-green-800'
      case 'General':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filter === 'all' ||
                         (filter === 'unread' && !announcement.isRead) ||
                         (filter === 'important' && announcement.priority === 'high')
    
    return matchesSearch && matchesFilter
  })

  const sortedAnnouncements = filteredAnnouncements.sort((a, b) => {
    // Pinned announcements first
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    
    // Then by date (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        <p className="text-gray-600">Stay updated with important school announcements</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            {['all', 'unread', 'important'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === filterType
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {sortedAnnouncements.map((announcement) => (
          <div
            key={announcement.id}
            className={`bg-white rounded-lg shadow-sm border-l-4 ${getPriorityColor(announcement.priority)} ${
              !announcement.isRead ? 'ring-2 ring-blue-100' : ''
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {announcement.isPinned && (
                      <Pin className="w-4 h-4 text-orange-500" />
                    )}
                    <h3 className={`text-lg font-semibold ${!announcement.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                      {announcement.title}
                    </h3>
                    {!announcement.isRead && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {announcement.author} ({announcement.authorRole})
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {announcement.createdAt.toLocaleDateString()}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(announcement.category)}`}>
                      {announcement.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                    announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {announcement.priority.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                {announcement.content}
              </p>
              
              {announcement.attachments.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments:</h4>
                  <div className="flex flex-wrap gap-2">
                    {announcement.attachments.map((attachment, index) => (
                      <button
                        key={index}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        <span>{attachment}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  {announcement.isRead ? 'Read' : 'Unread'}
                </div>
                {!announcement.isRead && (
                  <button
                    onClick={() => markAsRead(announcement.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedAnnouncements.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
          <p className="text-gray-500">
            {filter === 'all' ? 'No announcements available at the moment.' : `No ${filter} announcements found.`}
          </p>
        </div>
      )}
    </div>
  )
}

export default StudentAnnouncements
