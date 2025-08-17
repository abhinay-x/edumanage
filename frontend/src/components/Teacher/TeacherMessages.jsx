import React, { useState, useEffect } from 'react'
import { MessageSquare, Send, Search, Filter, Plus, User, Clock, Star, Archive, Trash2, Reply, Forward, MoreHorizontal } from 'lucide-react'
import toast from 'react-hot-toast'

const TeacherMessages = () => {
  const [activeView, setActiveView] = useState('inbox')
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showCompose, setShowCompose] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  const [composeForm, setComposeForm] = useState({
    to: '',
    subject: '',
    message: '',
    priority: 'normal',
    recipients: []
  })

  useEffect(() => {
    // Mock messages data
    const mockMessages = [
      {
        id: 1,
        from: 'Sarah Johnson (Parent)',
        fromEmail: 'sarah.johnson@email.com',
        subject: 'Question about homework assignment',
        message: 'Hi, I wanted to ask about the math homework assigned yesterday. My daughter is having trouble with problem #15. Could you provide some guidance?',
        timestamp: '2024-03-15T14:30:00Z',
        read: false,
        starred: false,
        priority: 'normal',
        type: 'received',
        avatar: null
      },
      {
        id: 2,
        from: 'Michael Davis (Student)',
        fromEmail: 'michael.davis@student.edu',
        subject: 'Request for assignment extension',
        message: 'Dear Teacher, I was sick yesterday and missed the class. Could I please get an extension for the project that was due today? I can submit it by tomorrow.',
        timestamp: '2024-03-15T10:15:00Z',
        read: true,
        starred: true,
        priority: 'high',
        type: 'received',
        avatar: null
      },
      {
        id: 3,
        from: 'Principal Office',
        fromEmail: 'principal@school.edu',
        subject: 'Parent-Teacher Conference Schedule',
        message: 'Please review the attached schedule for next week\'s parent-teacher conferences. Let us know if you need any changes to your assigned time slots.',
        timestamp: '2024-03-14T16:45:00Z',
        read: true,
        starred: false,
        priority: 'normal',
        type: 'received',
        avatar: null
      },
      {
        id: 4,
        from: 'You',
        to: 'Grade 10A Students',
        subject: 'Reminder: Quiz tomorrow',
        message: 'Dear students, this is a reminder that we have a quiz on Chapter 3 tomorrow. Please review the practice problems we discussed in class.',
        timestamp: '2024-03-14T12:00:00Z',
        read: true,
        starred: false,
        priority: 'normal',
        type: 'sent',
        avatar: null
      }
    ]

    setMessages(mockMessages)
    setLoading(false)
  }, [])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    try {
      const newMessage = {
        id: Date.now(),
        from: 'You',
        to: composeForm.to,
        subject: composeForm.subject,
        message: composeForm.message,
        timestamp: new Date().toISOString(),
        read: true,
        starred: false,
        priority: composeForm.priority,
        type: 'sent'
      }

      setMessages(prev => [newMessage, ...prev])
      toast.success('Message sent successfully!')
      resetComposeForm()
    } catch (error) {
      toast.error('Failed to send message')
    }
  }

  const resetComposeForm = () => {
    setComposeForm({
      to: '',
      subject: '',
      message: '',
      priority: 'normal',
      recipients: []
    })
    setShowCompose(false)
  }

  const toggleStar = (messageId) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
    ))
  }

  const markAsRead = (messageId) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ))
  }

  const deleteMessage = (messageId) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId))
    setSelectedMessage(null)
    toast.success('Message deleted')
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const filteredMessages = messages.filter(msg => {
    if (activeView === 'inbox') return msg.type === 'received'
    if (activeView === 'sent') return msg.type === 'sent'
    if (activeView === 'starred') return msg.starred
    return true
  }).filter(msg => 
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Communicate with students and parents</p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Compose
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveView('inbox')}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                  activeView === 'inbox' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="w-4 h-4 mr-3" />
                Inbox
                <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {messages.filter(m => m.type === 'received' && !m.read).length}
                </span>
              </button>
              <button
                onClick={() => setActiveView('sent')}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                  activeView === 'sent' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Send className="w-4 h-4 mr-3" />
                Sent
              </button>
              <button
                onClick={() => setActiveView('starred')}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                  activeView === 'starred' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Star className="w-4 h-4 mr-3" />
                Starred
              </button>
            </nav>
          </div>
        </div>

        {/* Message List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => {
                    setSelectedMessage(message)
                    if (!message.read) markAsRead(message.id)
                  }}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    !message.read ? 'bg-blue-50' : ''
                  } ${selectedMessage?.id === message.id ? 'bg-blue-100' : ''}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-sm ${!message.read ? 'font-semibold' : 'font-medium'} text-gray-900 truncate`}>
                          {message.from}
                        </p>
                        <div className="flex items-center space-x-1">
                          {message.starred && (
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          )}
                          <span className={`text-xs ${getPriorityColor(message.priority)}`}>
                            {message.priority === 'high' && '!'}
                          </span>
                        </div>
                      </div>
                      <p className={`text-sm ${!message.read ? 'font-medium' : ''} text-gray-900 truncate mb-1`}>
                        {message.subject}
                      </p>
                      <p className="text-xs text-gray-500 truncate mb-1">
                        {message.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(message.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedMessage.subject}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      From: {selectedMessage.from} • {new Date(selectedMessage.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleStar(selectedMessage.id)}
                      className={`p-2 rounded hover:bg-gray-100 ${
                        selectedMessage.starred ? 'text-yellow-500' : 'text-gray-400'
                      }`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="p-2 text-red-600 rounded hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                    <Reply className="w-4 h-4 mr-2" />
                    Reply
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center">
                    <Forward className="w-4 h-4 mr-2" />
                    Forward
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a message</h3>
              <p className="text-gray-500">Choose a message from the list to view its contents</p>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Compose Message</h3>
            
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <select
                  value={composeForm.to}
                  onChange={(e) => setComposeForm({ ...composeForm, to: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select recipient</option>
                  <option value="Grade 10A Students">Grade 10A Students</option>
                  <option value="Grade 10B Students">Grade 10B Students</option>
                  <option value="All Parents - Grade 10A">All Parents - Grade 10A</option>
                  <option value="Individual Student">Individual Student</option>
                  <option value="Individual Parent">Individual Parent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={composeForm.subject}
                  onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={composeForm.priority}
                  onChange={(e) => setComposeForm({ ...composeForm, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={composeForm.message}
                  onChange={(e) => setComposeForm({ ...composeForm, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="6"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetComposeForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherMessages
