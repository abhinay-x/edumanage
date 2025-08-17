import React, { useState, useEffect } from 'react'
import { MessageSquare, Send, Users, Bell, Mail, Phone, Calendar, Plus, Edit, Trash2, Search, Filter } from 'lucide-react'
import toast from 'react-hot-toast'

const Communications = () => {
  const [activeTab, setActiveTab] = useState('announcements')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRecipients, setSelectedRecipients] = useState([])
  const [loading, setLoading] = useState(true)

  const [announcements, setAnnouncements] = useState([])
  const [messages, setMessages] = useState([])
  const [notifications, setNotifications] = useState([])

  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    priority: 'medium',
    targetAudience: 'all',
    scheduledFor: '',
    expiresAt: ''
  })

  const [messageForm, setMessageForm] = useState({
    subject: '',
    content: '',
    recipients: [],
    type: 'email',
    scheduledFor: ''
  })

  useEffect(() => {
    // Mock data
    const mockAnnouncements = [
      {
        id: 1,
        title: 'Parent-Teacher Conference Schedule',
        content: 'Parent-teacher conferences will be held from March 15-17. Please book your slots through the parent portal.',
        priority: 'high',
        targetAudience: 'parents',
        author: 'Principal Office',
        createdAt: '2024-03-01T10:00:00Z',
        scheduledFor: '2024-03-05T08:00:00Z',
        expiresAt: '2024-03-20T23:59:59Z',
        status: 'published',
        views: 245,
        recipients: 850
      },
      {
        id: 2,
        title: 'Science Fair Registration Open',
        content: 'Students can now register for the annual science fair. Deadline for registration is March 25th.',
        priority: 'medium',
        targetAudience: 'students',
        author: 'Science Department',
        createdAt: '2024-02-28T14:30:00Z',
        scheduledFor: '2024-03-01T09:00:00Z',
        status: 'published',
        views: 156,
        recipients: 1250
      },
      {
        id: 3,
        title: 'New Cafeteria Menu',
        content: 'We have updated our cafeteria menu with more healthy options. Check out the new items starting Monday.',
        priority: 'low',
        targetAudience: 'all',
        author: 'Administration',
        createdAt: '2024-02-25T11:15:00Z',
        scheduledFor: '2024-02-26T08:00:00Z',
        status: 'published',
        views: 89,
        recipients: 2100
      }
    ]

    const mockMessages = [
      {
        id: 1,
        subject: 'Grade 10 Math Assignment Reminder',
        content: 'This is a reminder that the math assignment is due tomorrow.',
        type: 'email',
        recipients: ['Grade 10 A', 'Grade 10 B'],
        sentBy: 'Dr. Smith',
        sentAt: '2024-03-02T15:30:00Z',
        status: 'sent',
        deliveredCount: 62,
        readCount: 45
      },
      {
        id: 2,
        subject: 'Field Trip Permission Forms',
        content: 'Please submit the signed permission forms for the upcoming field trip by Friday.',
        type: 'sms',
        recipients: ['Grade 9 Parents'],
        sentBy: 'Ms. Johnson',
        sentAt: '2024-03-01T12:00:00Z',
        status: 'sent',
        deliveredCount: 280,
        readCount: 195
      }
    ]

    const mockNotifications = [
      {
        id: 1,
        title: 'Low Attendance Alert',
        message: '5 students have attendance below 75% this week',
        type: 'alert',
        priority: 'high',
        createdAt: '2024-03-03T09:00:00Z',
        read: false
      },
      {
        id: 2,
        title: 'New Parent Registration',
        message: '3 new parents have registered on the portal',
        type: 'info',
        priority: 'medium',
        createdAt: '2024-03-02T16:45:00Z',
        read: true
      }
    ]

    setAnnouncements(mockAnnouncements)
    setMessages(mockMessages)
    setNotifications(mockNotifications)
    setLoading(false)
  }, [])

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingItem) {
        const updatedAnnouncements = announcements.map(item =>
          item.id === editingItem.id
            ? { ...item, ...announcementForm, updatedAt: new Date().toISOString() }
            : item
        )
        setAnnouncements(updatedAnnouncements)
        toast.success('Announcement updated successfully!')
      } else {
        const newAnnouncement = {
          id: Date.now(),
          ...announcementForm,
          author: 'Admin',
          createdAt: new Date().toISOString(),
          status: announcementForm.scheduledFor ? 'scheduled' : 'published',
          views: 0,
          recipients: announcementForm.targetAudience === 'all' ? 2100 : 
                     announcementForm.targetAudience === 'students' ? 1250 :
                     announcementForm.targetAudience === 'teachers' ? 85 : 850
        }
        setAnnouncements([newAnnouncement, ...announcements])
        toast.success('Announcement created successfully!')
      }
      resetForms()
    } catch (error) {
      toast.error('Failed to save announcement')
    }
  }

  const handleMessageSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const newMessage = {
        id: Date.now(),
        ...messageForm,
        sentBy: 'Admin',
        sentAt: new Date().toISOString(),
        status: messageForm.scheduledFor ? 'scheduled' : 'sent',
        deliveredCount: 0,
        readCount: 0
      }
      setMessages([newMessage, ...messages])
      toast.success(`${messageForm.type === 'email' ? 'Email' : 'SMS'} sent successfully!`)
      resetForms()
    } catch (error) {
      toast.error('Failed to send message')
    }
  }

  const resetForms = () => {
    setAnnouncementForm({
      title: '',
      content: '',
      priority: 'medium',
      targetAudience: 'all',
      scheduledFor: '',
      expiresAt: ''
    })
    setMessageForm({
      subject: '',
      content: '',
      recipients: [],
      type: 'email',
      scheduledFor: ''
    })
    setEditingItem(null)
    setShowModal(false)
  }

  const handleEdit = (item, type) => {
    setEditingItem(item)
    if (type === 'announcement') {
      setAnnouncementForm({
        title: item.title,
        content: item.content,
        priority: item.priority,
        targetAudience: item.targetAudience,
        scheduledFor: item.scheduledFor ? item.scheduledFor.split('T')[0] + 'T' + item.scheduledFor.split('T')[1].slice(0, 5) : '',
        expiresAt: item.expiresAt ? item.expiresAt.split('T')[0] + 'T' + item.expiresAt.split('T')[1].slice(0, 5) : ''
      })
    }
    setShowModal(true)
  }

  const handleDelete = async (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        if (type === 'announcement') {
          setAnnouncements(announcements.filter(item => item.id !== id))
        } else if (type === 'message') {
          setMessages(messages.filter(item => item.id !== id))
        }
        toast.success(`${type} deleted successfully!`)
      } catch (error) {
        toast.error(`Failed to delete ${type}`)
      }
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'sent': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
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
          <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
          <p className="text-gray-600">Manage announcements, messages, and notifications</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create {activeTab === 'announcements' ? 'Announcement' : 'Message'}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'announcements', name: 'Announcements', icon: Bell },
              { id: 'messages', name: 'Messages', icon: Mail },
              { id: 'notifications', name: 'Notifications', icon: MessageSquare }
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
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Announcements */}
          {activeTab === 'announcements' && (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-semibold text-lg mr-3">{announcement.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded border ${getPriorityColor(announcement.priority)}`}>
                          {announcement.priority.toUpperCase()}
                        </span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded ${getStatusColor(announcement.status)}`}>
                          {announcement.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{announcement.content}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Author:</span> {announcement.author}
                        </div>
                        <div>
                          <span className="font-medium">Audience:</span> {announcement.targetAudience}
                        </div>
                        <div>
                          <span className="font-medium">Views:</span> {announcement.views}
                        </div>
                        <div>
                          <span className="font-medium">Recipients:</span> {announcement.recipients}
                        </div>
                      </div>
                      {announcement.scheduledFor && (
                        <div className="mt-2 text-sm text-blue-600">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Scheduled for: {new Date(announcement.scheduledFor).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(announcement, 'announcement')}
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id, 'announcement')}
                        className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Messages */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-semibold text-lg mr-3">{message.subject}</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {message.type.toUpperCase()}
                        </span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded ${getStatusColor(message.status)}`}>
                          {message.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{message.content}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Sent by:</span> {message.sentBy}
                        </div>
                        <div>
                          <span className="font-medium">Recipients:</span> {message.recipients.join(', ')}
                        </div>
                        <div>
                          <span className="font-medium">Delivered:</span> {message.deliveredCount}
                        </div>
                        <div>
                          <span className="font-medium">Read:</span> {message.readCount}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Sent: {new Date(message.sentAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleDelete(message.id, 'message')}
                        className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className={`border rounded-lg p-4 ${notification.read ? 'bg-gray-50' : 'bg-white border-blue-200'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-semibold mr-3">{notification.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(notification.priority)}`}>
                          {notification.priority.toUpperCase()}
                        </span>
                        {!notification.read && (
                          <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{notification.message}</p>
                      <div className="text-sm text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Edit' : 'Create'} {activeTab === 'announcements' ? 'Announcement' : 'Message'}
            </h3>
            
            {activeTab === 'announcements' ? (
              <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={announcementForm.priority}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                    <select
                      value={announcementForm.targetAudience}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, targetAudience: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All</option>
                      <option value="students">Students</option>
                      <option value="teachers">Teachers</option>
                      <option value="parents">Parents</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Schedule For (Optional)</label>
                    <input
                      type="datetime-local"
                      value={announcementForm.scheduledFor}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, scheduledFor: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expires At (Optional)</label>
                    <input
                      type="datetime-local"
                      value={announcementForm.expiresAt}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, expiresAt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForms}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingItem ? 'Update' : 'Create'} Announcement
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleMessageSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={messageForm.subject}
                    onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message Content</label>
                  <textarea
                    value={messageForm.content}
                    onChange={(e) => setMessageForm({ ...messageForm, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
                    <select
                      value={messageForm.type}
                      onChange={(e) => setMessageForm({ ...messageForm, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Schedule For (Optional)</label>
                    <input
                      type="datetime-local"
                      value={messageForm.scheduledFor}
                      onChange={(e) => setMessageForm({ ...messageForm, scheduledFor: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                  <select
                    multiple
                    value={messageForm.recipients}
                    onChange={(e) => setMessageForm({ ...messageForm, recipients: Array.from(e.target.selectedOptions, option => option.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    size="4"
                  >
                    <option value="Grade 9 A">Grade 9 A</option>
                    <option value="Grade 9 B">Grade 9 B</option>
                    <option value="Grade 10 A">Grade 10 A</option>
                    <option value="Grade 10 B">Grade 10 B</option>
                    <option value="Grade 11 A">Grade 11 A</option>
                    <option value="Grade 11 B">Grade 11 B</option>
                    <option value="All Teachers">All Teachers</option>
                    <option value="All Parents">All Parents</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple recipients</p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForms}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send {messageForm.type === 'email' ? 'Email' : 'SMS'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Communications
