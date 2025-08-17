import React, { useState, useEffect } from 'react'
import { Calendar, Plus, Edit, Archive, CheckCircle, AlertTriangle, Trash2, Search } from 'lucide-react'
import toast from 'react-hot-toast'

const AcademicYears = () => {
  const [academicYears, setAcademicYears] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingYear, setEditingYear] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    status: 'upcoming',
    description: ''
  })

  useEffect(() => {
    // Mock data for academic years
    const mockYears = [
      {
        id: 1,
        name: '2024-2025',
        startDate: '2024-08-01',
        endDate: '2025-07-31',
        status: 'active',
        description: 'Current academic year',
        totalStudents: 1250,
        totalTeachers: 85,
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        name: '2023-2024',
        startDate: '2023-08-01',
        endDate: '2024-07-31',
        status: 'archived',
        description: 'Previous academic year',
        totalStudents: 1180,
        totalTeachers: 78,
        createdAt: '2023-01-10'
      },
      {
        id: 3,
        name: '2025-2026',
        startDate: '2025-08-01',
        endDate: '2026-07-31',
        status: 'upcoming',
        description: 'Next academic year planning',
        totalStudents: 0,
        totalTeachers: 0,
        createdAt: '2024-02-20'
      }
    ]

    setAcademicYears(mockYears)
    setLoading(false)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingYear) {
        // Update existing year
        const updatedYears = academicYears.map(year =>
          year.id === editingYear.id
            ? { ...year, ...formData, updatedAt: new Date().toISOString() }
            : year
        )
        setAcademicYears(updatedYears)
        toast.success('Academic year updated successfully!')
      } else {
        // Create new year
        const newYear = {
          id: Date.now(),
          ...formData,
          totalStudents: 0,
          totalTeachers: 0,
          createdAt: new Date().toISOString()
        }
        setAcademicYears([...academicYears, newYear])
        toast.success('Academic year created successfully!')
      }

      resetForm()
    } catch (error) {
      toast.error('Failed to save academic year')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      status: 'upcoming',
      description: ''
    })
    setEditingYear(null)
    setShowModal(false)
  }

  const handleEdit = (year) => {
    setEditingYear(year)
    setFormData({
      name: year.name,
      startDate: year.startDate,
      endDate: year.endDate,
      status: year.status,
      description: year.description
    })
    setShowModal(true)
  }

  const handleDelete = async (yearId) => {
    if (window.confirm('Are you sure you want to delete this academic year?')) {
      try {
        setAcademicYears(academicYears.filter(year => year.id !== yearId))
        toast.success('Academic year deleted successfully!')
      } catch (error) {
        toast.error('Failed to delete academic year')
      }
    }
  }

  const handleSetActive = async (yearId) => {
    try {
      const updatedYears = academicYears.map(year => ({
        ...year,
        status: year.id === yearId ? 'active' : year.status === 'active' ? 'archived' : year.status
      }))
      setAcademicYears(updatedYears)
      toast.success('Active academic year updated!')
    } catch (error) {
      toast.error('Failed to update active year')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />
      case 'upcoming': return <Calendar className="w-4 h-4" />
      case 'archived': return <Archive className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const filteredYears = academicYears.filter(year =>
    year.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    year.description.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">Academic Years</h1>
          <p className="text-gray-600">Manage academic years and school calendar</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Academic Year
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search academic years..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Academic Years Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredYears.map((year) => (
          <div key={year.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{year.name}</h3>
                <p className="text-sm text-gray-500">{year.description}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(year.status)}`}>
                {getStatusIcon(year.status)}
                <span className="ml-1 capitalize">{year.status}</span>
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Start Date:</span>
                <span className="font-medium">{new Date(year.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">End Date:</span>
                <span className="font-medium">{new Date(year.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Students:</span>
                <span className="font-medium">{year.totalStudents}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Teachers:</span>
                <span className="font-medium">{year.totalTeachers}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(year)}
                className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center justify-center"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
              
              {year.status !== 'active' && (
                <button
                  onClick={() => handleSetActive(year.id)}
                  className="flex-1 px-3 py-2 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100 flex items-center justify-center"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Set Active
                </button>
              )}
              
              <button
                onClick={() => handleDelete(year.id)}
                className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingYear ? 'Edit Academic Year' : 'Add Academic Year'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Year Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2024-2025"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Optional description"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingYear ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AcademicYears
