import React, { useState, useEffect } from 'react'
import { FileText, Download, BookOpen, Search, Filter, Video, Image, FileArchive, File, Eye, Star, Clock, Bookmark, Heart } from 'lucide-react'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const StudentResources = () => {
  const { user } = useAuth()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [bookmarkedResources, setBookmarkedResources] = useState(new Set())
  const [showBookmarked, setShowBookmarked] = useState(false)

  const categories = [
    { id: 'all', name: 'All Resources', icon: BookOpen },
    { id: 'notes', name: 'Study Notes', icon: FileText },
    { id: 'videos', name: 'Video Lectures', icon: Video },
    { id: 'presentations', name: 'Presentations', icon: Image },
    { id: 'books', name: 'E-Books', icon: BookOpen },
    { id: 'practice', name: 'Practice Papers', icon: File },
    { id: 'archives', name: 'Archives', icon: FileArchive }
  ]

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Computer Science']

  useEffect(() => {
    fetchResources()
  }, [user])

  const fetchResources = async () => {
    try {
      // Mock data for demonstration - replace with actual Firebase query
      const mockResources = [
        {
          id: '1',
          title: 'Algebra Fundamentals - Chapter 1',
          description: 'Complete notes covering basic algebraic concepts and equations',
          subject: 'Mathematics',
          category: 'notes',
          type: 'pdf',
          size: '2.5 MB',
          uploadedBy: 'Dr. Smith',
          uploadedAt: new Date('2024-01-15'),
          downloads: 45,
          rating: 4.8,
          tags: ['algebra', 'equations', 'fundamentals'],
          url: '#',
          thumbnail: null,
          featured: true
        },
        {
          id: '2',
          title: 'Photosynthesis Process Video',
          description: 'Detailed explanation of photosynthesis with animations',
          subject: 'Science',
          category: 'videos',
          type: 'mp4',
          size: '125 MB',
          uploadedBy: 'Ms. Johnson',
          uploadedAt: new Date('2024-01-10'),
          downloads: 78,
          rating: 4.9,
          tags: ['biology', 'photosynthesis', 'plants'],
          url: '#',
          thumbnail: '/api/placeholder/300/200',
          featured: false
        },
        {
          id: '3',
          title: 'Shakespeare Presentation',
          description: 'Comprehensive presentation on Shakespeare\'s major works',
          subject: 'English',
          category: 'presentations',
          type: 'pptx',
          size: '15 MB',
          uploadedBy: 'Mr. Brown',
          uploadedAt: new Date('2024-01-08'),
          downloads: 32,
          rating: 4.6,
          tags: ['shakespeare', 'literature', 'drama'],
          url: '#',
          thumbnail: null,
          featured: false
        },
        {
          id: '4',
          title: 'World War II Timeline',
          description: 'Interactive timeline of major WWII events',
          subject: 'History',
          category: 'notes',
          type: 'pdf',
          size: '8.2 MB',
          uploadedBy: 'Dr. Wilson',
          uploadedAt: new Date('2024-01-05'),
          downloads: 67,
          rating: 4.7,
          tags: ['wwii', 'timeline', 'history'],
          url: '#',
          thumbnail: null,
          featured: true
        },
        {
          id: '5',
          title: 'Python Programming Basics',
          description: 'Introduction to Python programming with examples',
          subject: 'Computer Science',
          category: 'books',
          type: 'pdf',
          size: '45 MB',
          uploadedBy: 'Prof. Davis',
          uploadedAt: new Date('2024-01-12'),
          downloads: 156,
          rating: 4.9,
          tags: ['python', 'programming', 'basics'],
          url: '#',
          thumbnail: null,
          featured: true
        },
        {
          id: '6',
          title: 'Mathematics Practice Papers 2024',
          description: 'Collection of practice papers for final exams',
          subject: 'Mathematics',
          category: 'practice',
          type: 'zip',
          size: '12 MB',
          uploadedBy: 'Dr. Smith',
          uploadedAt: new Date('2024-01-18'),
          downloads: 89,
          rating: 4.5,
          tags: ['practice', 'exams', 'mathematics'],
          url: '#',
          thumbnail: null,
          featured: false
        }
      ]
      setResources(mockResources)
    } catch (error) {
      console.error('Error fetching resources:', error)
      toast.error('Failed to load resources')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (resource) => {
    try {
      // Simulate download
      toast.success(`Downloading ${resource.title}...`)
      
      // Update download count
      const updatedResources = resources.map(r => 
        r.id === resource.id ? { ...r, downloads: r.downloads + 1 } : r
      )
      setResources(updatedResources)
    } catch (error) {
      console.error('Error downloading resource:', error)
      toast.error('Failed to download resource')
    }
  }

  const handleBookmark = async (resourceId) => {
    try {
      const newBookmarked = new Set(bookmarkedResources)
      if (newBookmarked.has(resourceId)) {
        newBookmarked.delete(resourceId)
        toast.success('Bookmark removed')
      } else {
        newBookmarked.add(resourceId)
        toast.success('Resource bookmarked')
      }
      setBookmarkedResources(newBookmarked)
    } catch (error) {
      console.error('Error bookmarking resource:', error)
      toast.error('Failed to bookmark resource')
    }
  }

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <FileText className="w-8 h-8 text-red-500" />
      case 'mp4': return <Video className="w-8 h-8 text-blue-500" />
      case 'pptx': return <Image className="w-8 h-8 text-orange-500" />
      case 'zip': return <FileArchive className="w-8 h-8 text-purple-500" />
      default: return <File className="w-8 h-8 text-gray-500" />
    }
  }

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject
    const matchesBookmark = !showBookmarked || bookmarkedResources.has(resource.id)
    
    return matchesSearch && matchesCategory && matchesSubject && matchesBookmark
  })

  const featuredResources = resources.filter(resource => resource.featured)

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
        <h1 className="text-2xl font-bold text-gray-900">Study Resources</h1>
        <p className="text-gray-600">Access learning materials and educational resources</p>
      </div>

      {/* Featured Resources */}
      {featuredResources.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Star className="w-5 h-5 text-yellow-500 mr-2" />
            Featured Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResources.slice(0, 3).map((resource) => (
              <div key={resource.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    {getFileIcon(resource.type)}
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900">{resource.title}</h3>
                      <p className="text-sm text-gray-500">{resource.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleBookmark(resource.id)}
                      className={`p-1 rounded ${bookmarkedResources.has(resource.id) ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Featured
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {resource.uploadDate}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownload(resource)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            
            <button
              onClick={() => setShowBookmarked(!showBookmarked)}
              className={`px-3 py-2 border border-gray-300 rounded-lg ${showBookmarked ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Bookmark className="w-4 h-4 mr-1 inline" />
              Bookmarked
            </button>
            
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredResources.map((resource) => (
          <div key={resource.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 ${viewMode === 'list' ? 'p-4' : 'p-6'}`}>
            {viewMode === 'grid' ? (
              // Grid View
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {getFileIcon(resource.type)}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{resource.title}</h3>
                    <p className="text-sm text-gray-500">{resource.subject}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">{resource.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>By {resource.uploadedBy}</span>
                  <span>{resource.size}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Download className="w-3 h-3 mr-1" />
                      {resource.downloads}
                    </span>
                    <span className="flex items-center">
                      <Star className="w-3 h-3 mr-1 text-yellow-500" />
                      {resource.rating}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleBookmark(resource.id)}
                      className={`p-1 rounded ${bookmarkedResources.has(resource.id) ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(resource)}
                      className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {resource.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              // List View
              <div className="flex items-center space-x-4">
                {getFileIcon(resource.type)}
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{resource.title}</h3>
                  <p className="text-gray-600 text-sm truncate">{resource.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                    <span>{resource.subject}</span>
                    <span>By {resource.uploadedBy}</span>
                    <span>{resource.size}</span>
                    <span className="flex items-center">
                      <Download className="w-3 h-3 mr-1" />
                      {resource.downloads}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBookmark(resource.id)}
                    className={`p-2 rounded ${bookmarkedResources.has(resource.id) ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(resource)}
                    className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-500">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  )
}

export default StudentResources
