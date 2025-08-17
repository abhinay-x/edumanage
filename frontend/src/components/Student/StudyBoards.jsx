import React, { useState, useEffect } from 'react'
import { BookOpen, Users, Brain, Plus, Search, MessageSquare, Star, Clock, User, Settings, Bot } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const StudyBoards = () => {
  const { user } = useAuth()
  const [studyBoards, setStudyBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all') // all, my-boards, joined
  const [newBoard, setNewBoard] = useState({
    title: '',
    subject: '',
    description: '',
    isPrivate: false,
    maxMembers: 10
  })

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Computer Science']

  useEffect(() => {
    fetchStudyBoards()
  }, [user])

  const fetchStudyBoards = async () => {
    try {
      // Mock data for demonstration - replace with actual Firebase query
      const mockBoards = [
        {
          id: '1',
          title: 'Advanced Mathematics Study Group',
          subject: 'Mathematics',
          description: 'Preparing for calculus and advanced algebra topics. Weekly problem-solving sessions.',
          creator: 'John Doe',
          createdAt: new Date('2024-01-15'),
          members: 8,
          maxMembers: 12,
          isPrivate: false,
          isJoined: true,
          isCreator: true,
          lastActivity: new Date('2024-01-20'),
          tags: ['calculus', 'algebra', 'problem-solving'],
          aiTutorEnabled: true
        },
        {
          id: '2',
          title: 'Physics Lab Discussion',
          subject: 'Science',
          description: 'Discuss lab experiments, share findings, and prepare for physics practicals.',
          creator: 'Sarah Wilson',
          createdAt: new Date('2024-01-10'),
          members: 6,
          maxMembers: 8,
          isPrivate: false,
          isJoined: true,
          isCreator: false,
          lastActivity: new Date('2024-01-19'),
          tags: ['physics', 'lab', 'experiments'],
          aiTutorEnabled: true
        },
        {
          id: '3',
          title: 'English Literature Circle',
          subject: 'English',
          description: 'Reading and analyzing classic literature. Currently studying Shakespeare.',
          creator: 'Mike Johnson',
          createdAt: new Date('2024-01-08'),
          members: 5,
          maxMembers: 10,
          isPrivate: true,
          isJoined: false,
          isCreator: false,
          lastActivity: new Date('2024-01-18'),
          tags: ['literature', 'shakespeare', 'analysis'],
          aiTutorEnabled: false
        },
        {
          id: '4',
          title: 'Computer Science Coding Club',
          subject: 'Computer Science',
          description: 'Learn programming together, work on projects, and prepare for coding competitions.',
          creator: 'Alex Chen',
          createdAt: new Date('2024-01-12'),
          members: 15,
          maxMembers: 20,
          isPrivate: false,
          isJoined: false,
          isCreator: false,
          lastActivity: new Date('2024-01-21'),
          tags: ['programming', 'projects', 'competitions'],
          aiTutorEnabled: true
        }
      ]
      setStudyBoards(mockBoards)
    } catch (error) {
      console.error('Error fetching study boards:', error)
      toast.error('Failed to load study boards')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBoard = async () => {
    if (!newBoard.title || !newBoard.subject || !newBoard.description) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const boardData = {
        ...newBoard,
        id: Date.now().toString(),
        creator: `${user.firstName} ${user.lastName}`,
        createdAt: new Date(),
        members: 1,
        isJoined: true,
        isCreator: true,
        lastActivity: new Date(),
        tags: [],
        aiTutorEnabled: true
      }

      setStudyBoards(prev => [boardData, ...prev])
      setShowCreateModal(false)
      setNewBoard({ title: '', subject: '', description: '', isPrivate: false, maxMembers: 10 })
      toast.success('Study board created successfully!')
    } catch (error) {
      console.error('Error creating study board:', error)
      toast.error('Failed to create study board')
    }
  }

  const handleJoinBoard = async (boardId) => {
    try {
      const updatedBoards = studyBoards.map(board =>
        board.id === boardId
          ? { ...board, isJoined: true, members: board.members + 1 }
          : board
      )
      setStudyBoards(updatedBoards)
      toast.success('Joined study board successfully!')
    } catch (error) {
      console.error('Error joining study board:', error)
      toast.error('Failed to join study board')
    }
  }

  const handleLeaveBoard = async (boardId) => {
    try {
      const updatedBoards = studyBoards.map(board =>
        board.id === boardId
          ? { ...board, isJoined: false, members: board.members - 1 }
          : board
      )
      setStudyBoards(updatedBoards)
      toast.success('Left study board successfully!')
    } catch (error) {
      console.error('Error leaving study board:', error)
      toast.error('Failed to leave study board')
    }
  }

  const filteredBoards = studyBoards.filter(board => {
    const matchesSearch = board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         board.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         board.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filter === 'all' ||
                         (filter === 'my-boards' && board.isCreator) ||
                         (filter === 'joined' && board.isJoined)
    
    return matchesSearch && matchesFilter
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Boards</h1>
          <p className="text-gray-600">Collaborative learning and AI tutoring</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Create Board</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search study boards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            {['all', 'my-boards', 'joined'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === filterType
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {filterType === 'my-boards' ? 'My Boards' : 
                 filterType === 'joined' ? 'Joined' : 'All'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Study Boards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBoards.map((board) => (
          <div key={board.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{board.title}</h3>
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-2">
                  {board.subject}
                </span>
                {board.isPrivate && (
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full ml-2">
                    Private
                  </span>
                )}
              </div>
              {board.aiTutorEnabled && (
                <Bot className="w-5 h-5 text-purple-600" title="AI Tutor Enabled" />
              )}
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{board.description}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {board.members}/{board.maxMembers}
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {board.creator}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>Created: {board.createdAt.toLocaleDateString()}</span>
              <span>Active: {board.lastActivity.toLocaleDateString()}</span>
            </div>
            
            {board.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {board.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex space-x-2">
              {board.isJoined ? (
                <>
                  <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <MessageSquare className="w-4 h-4" />
                    <span>Enter</span>
                  </button>
                  {!board.isCreator && (
                    <button
                      onClick={() => handleLeaveBoard(board.id)}
                      className="px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                    >
                      Leave
                    </button>
                  )}
                  {board.isCreator && (
                    <button className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Settings className="w-4 h-4" />
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => handleJoinBoard(board.id)}
                  disabled={board.members >= board.maxMembers}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {board.members >= board.maxMembers ? 'Full' : 'Join'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBoards.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No study boards found</h3>
          <p className="text-gray-500 mb-4">
            {filter === 'all' ? 'Create your first study board to start collaborating!' : `No ${filter.replace('-', ' ')} found.`}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Study Board
          </button>
        </div>
      )}

      {/* Create Board Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Study Board</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newBoard.title}
                  onChange={(e) => setNewBoard(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter board title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  value={newBoard.subject}
                  onChange={(e) => setNewBoard(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={newBoard.description}
                  onChange={(e) => setNewBoard(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your study board"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Members
                </label>
                <input
                  type="number"
                  value={newBoard.maxMembers}
                  onChange={(e) => setNewBoard(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                  min="2"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={newBoard.isPrivate}
                  onChange={(e) => setNewBoard(prev => ({ ...prev, isPrivate: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="isPrivate" className="text-sm text-gray-700">
                  Make this board private
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBoard}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Board
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudyBoards
