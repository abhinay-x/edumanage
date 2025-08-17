import React, { useState, useEffect } from 'react'
import { MessageSquare, Inbox, Send, Search, Plus, Reply, Trash2, Star, Clock, User } from 'lucide-react'

const StudentMessages = () => {
  const [messages, setMessages] = useState([])
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [showCompose, setShowCompose] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock messages data
    const mockMessages = [
      {
        id: 1,
        from: 'Dr. Smith',
        fromRole: 'Teacher',
        subject: 'Assignment 2 Feedback',
        preview: 'Great work on your latest assignment. I have some feedback...',
        content: 'Dear Student,\n\nI wanted to provide you with feedback on Assignment 2. Your analysis was thorough and well-structured. However, I noticed a few areas where you could improve:\n\n1. Mathematical calculations in section 3\n2. Citation format needs adjustment\n3. Conclusion could be more detailed\n\nOverall, excellent work! Keep it up.\n\nBest regards,\nDr. Smith',
        timestamp: '2024-02-20 10:30 AM',
        read: false,
        starred: true,
        type: 'feedback'
      },
      {
        id: 2,
        from: 'Prof. Johnson',
        fromRole: 'Teacher',
        subject: 'Lab Session Rescheduled',
        preview: 'The physics lab session scheduled for tomorrow has been...',
        content: 'Dear Students,\n\nDue to equipment maintenance, tomorrow\'s physics lab session has been rescheduled to Friday at 2:00 PM in Lab Room B.\n\nPlease bring your lab manuals and safety goggles.\n\nThank you for your understanding.\n\nProf. Johnson',
        timestamp: '2024-02-19 3:45 PM',
        read: true,
        starred: false,
        type: 'announcement'
      },
      {
        id: 3,
        from: 'Sarah Wilson',
        fromRole: 'Student',
        subject: 'Study Group for Chemistry',
        preview: 'Hi! Would you like to join our chemistry study group?',
        content: 'Hi there!\n\nWe\'re forming a study group for the upcoming chemistry exam. We plan to meet every Tuesday and Thursday at 4 PM in the library.\n\nInterested? Let me know!\n\nBest,\nSarah',
        timestamp: '2024-02-18 2:15 PM',
        read: true,
        starred: false,
        type: 'peer'
      },
      {
        id: 4,
        from: 'Academic Office',
        fromRole: 'Administration',
        subject: 'Mid-term Exam Schedule',
        preview: 'Your mid-term examination schedule is now available...',
        content: 'Dear Student,\n\nYour mid-term examination schedule is now available on the student portal.\n\nExam dates:\n- Mathematics: March 15, 9:00 AM\n- Physics: March 17, 11:00 AM\n- Chemistry: March 19, 2:00 PM\n- English: March 21, 10:00 AM\n\nPlease review and prepare accordingly.\n\nAcademic Office',
        timestamp: '2024-02-17 11:20 AM',
        read: true,
        starred: true,
        type: 'official'
      },
      {
        id: 5,
        from: 'Ms. Davis',
        fromRole: 'Teacher',
        subject: 'Essay Submission Reminder',
        preview: 'This is a reminder that your English essay is due...',
        content: 'Dear Students,\n\nThis is a friendly reminder that your English Literature essay on "Modern Poetry Analysis" is due this Friday by 11:59 PM.\n\nSubmission guidelines:\n- Minimum 1500 words\n- MLA format\n- At least 5 scholarly sources\n- Submit via student portal\n\nLate submissions will incur a penalty.\n\nBest regards,\nMs. Davis',
        timestamp: '2024-02-16 4:30 PM',
        read: false,
        starred: false,
        type: 'reminder'
      }
    ]

    setMessages(mockMessages)
    setLoading(false)
  }, [])

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.preview.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !message.read) ||
                         (filter === 'starred' && message.starred) ||
                         (filter === 'teachers' && message.fromRole === 'Teacher')
    
    return matchesSearch && matchesFilter
  })

  const getMessageTypeColor = (type) => {
    switch (type) {
      case 'feedback': return 'bg-blue-100 text-blue-800'
      case 'announcement': return 'bg-yellow-100 text-yellow-800'
      case 'peer': return 'bg-green-100 text-green-800'
      case 'official': return 'bg-purple-100 text-purple-800'
      case 'reminder': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const markAsRead = (messageId) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ))
  }

  const toggleStar = (messageId) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
    ))
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
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Communicate with teachers and classmates</p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Compose
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex space-x-2">
              {['all', 'unread', 'starred', 'teachers'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 py-1 text-xs rounded-full capitalize ${
                    filter === filterType
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filterType}
                </button>
              ))}
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
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${!message.read ? 'font-semibold' : 'font-medium'}`}>
                        {message.from}
                      </p>
                      <p className="text-xs text-gray-500">{message.fromRole}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {message.starred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                    {!message.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                  </div>
                </div>
                
                <h4 className={`text-sm mb-1 truncate ${!message.read ? 'font-semibold' : ''}`}>
                  {message.subject}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">{message.preview}</p>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded ${getMessageTypeColor(message.type)}`}>
                    {message.type}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {message.timestamp.split(' ')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Content */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          {selectedMessage ? (
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedMessage.subject}</h2>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      <span className="font-medium">{selectedMessage.from}</span>
                      <span className="mx-2">•</span>
                      <span>{selectedMessage.fromRole}</span>
                      <span className="mx-2">•</span>
                      <span>{selectedMessage.timestamp}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleStar(selectedMessage.id)}
                      className={`p-2 rounded ${selectedMessage.starred ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Star className={`w-4 h-4 ${selectedMessage.starred ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded">
                      <Reply className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMessageTypeColor(selectedMessage.type)}`}>
                  {selectedMessage.type}
                </span>
              </div>
              
              <div className="flex-1 p-6">
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                    {selectedMessage.content}
                  </pre>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                  <Reply className="w-4 h-4 mr-2" />
                  Reply
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Message</h3>
                <p className="text-gray-500">Choose a message from the list to view its content</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentMessages
