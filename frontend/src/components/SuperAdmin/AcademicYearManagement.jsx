import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore'
import { db } from '../../config/firebase'
import toast from 'react-hot-toast'
import AcademicYearForm from './AcademicYearForm'

const AcademicYearManagement = () => {
  const [academicYears, setAcademicYears] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingYear, setEditingYear] = useState(null)

  useEffect(() => {
    fetchAcademicYears()
  }, [])

  const fetchAcademicYears = async () => {
    try {
      const yearsQuery = query(collection(db, 'academicYears'), orderBy('startDate', 'desc'))
      const yearsSnapshot = await getDocs(yearsQuery)
      const yearsData = yearsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setAcademicYears(yearsData)
    } catch (error) {
      console.error('Error fetching academic years:', error)
      toast.error('Failed to fetch academic years')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateYear = async (yearData) => {
    try {
      await addDoc(collection(db, 'academicYears'), {
        ...yearData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      toast.success('Academic year created successfully!')
      setShowForm(false)
      fetchAcademicYears()
    } catch (error) {
      console.error('Error creating academic year:', error)
      toast.error('Failed to create academic year')
    }
  }

  const handleUpdateYear = async (yearId, yearData) => {
    try {
      const yearRef = doc(db, 'academicYears', yearId)
      await updateDoc(yearRef, {
        ...yearData,
        updatedAt: new Date().toISOString()
      })

      toast.success('Academic year updated successfully!')
      setShowForm(false)
      setEditingYear(null)
      fetchAcademicYears()
    } catch (error) {
      console.error('Error updating academic year:', error)
      toast.error('Failed to update academic year')
    }
  }

  const handleDeleteYear = async (yearId) => {
    if (window.confirm('Are you sure you want to delete this academic year? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'academicYears', yearId))
        toast.success('Academic year deleted successfully!')
        fetchAcademicYears()
      } catch (error) {
        console.error('Error deleting academic year:', error)
        toast.error('Failed to delete academic year')
      }
    }
  }

  const handleSetActive = async (yearId, currentStatus) => {
    try {
      // First, set all years to inactive
      const batch = []
      academicYears.forEach(year => {
        if (year.id !== yearId && year.isActive) {
          batch.push(updateDoc(doc(db, 'academicYears', year.id), { isActive: false }))
        }
      })
      
      // Execute batch updates
      await Promise.all(batch)
      
      // Set the selected year as active
      const yearRef = doc(db, 'academicYears', yearId)
      await updateDoc(yearRef, {
        isActive: !currentStatus,
        updatedAt: new Date().toISOString()
      })

      toast.success(`Academic year ${!currentStatus ? 'activated' : 'deactivated'} successfully!`)
      fetchAcademicYears()
    } catch (error) {
      console.error('Error updating academic year status:', error)
      toast.error('Failed to update academic year status')
    }
  }

  const getStatusColor = (year) => {
    if (year.isActive) return 'text-green-600'
    
    const now = new Date()
    const startDate = new Date(year.startDate)
    const endDate = new Date(year.endDate)
    
    if (now < startDate) return 'text-blue-600'
    if (now > endDate) return 'text-gray-600'
    return 'text-orange-600'
  }

  const getStatusText = (year) => {
    if (year.isActive) return 'Active'
    
    const now = new Date()
    const startDate = new Date(year.startDate)
    const endDate = new Date(year.endDate)
    
    if (now < startDate) return 'Upcoming'
    if (now > endDate) return 'Completed'
    return 'Inactive'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Year Management</h1>
          <p className="text-gray-600">Manage academic years and terms for your institution</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 btn btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Academic Year
        </button>
      </div>

      {/* Academic Years Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {academicYears.map((year) => (
          <div key={year.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{year.name}</h3>
                <p className="text-sm text-gray-600">{year.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditingYear(year)
                    setShowForm(true)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteYear(year.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(year.startDate).toLocaleDateString()} - {new Date(year.endDate).toLocaleDateString()}
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${getStatusColor(year)}`}>
                  {getStatusText(year)}
                </span>
                <button
                  onClick={() => handleSetActive(year.id, year.isActive)}
                  className={`flex items-center text-xs px-2 py-1 rounded-full ${
                    year.isActive 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {year.isActive ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 mr-1" />
                      Set Active
                    </>
                  )}
                </button>
              </div>

              {year.terms && year.terms.length > 0 && (
                <div className="pt-3 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Terms</h4>
                  <div className="space-y-1">
                    {year.terms.map((term, index) => (
                      <div key={index} className="text-xs text-gray-600 flex justify-between">
                        <span>{term.name}</span>
                        <span>
                          {new Date(term.startDate).toLocaleDateString()} - {new Date(term.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {academicYears.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No academic years found</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first academic year.</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            Add Academic Year
          </button>
        </div>
      )}

      {/* Academic Year Form Modal */}
      {showForm && (
        <AcademicYearForm
          year={editingYear}
          onSubmit={editingYear ? 
            (data) => handleUpdateYear(editingYear.id, data) : 
            handleCreateYear
          }
          onClose={() => {
            setShowForm(false)
            setEditingYear(null)
          }}
        />
      )}
    </div>
  )
}

export default AcademicYearManagement
