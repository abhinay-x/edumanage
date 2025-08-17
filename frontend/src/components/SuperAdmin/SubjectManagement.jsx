import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, BookOpen, Users } from 'lucide-react'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore'
import { db } from '../../config/firebase'
import toast from 'react-hot-toast'
import SubjectForm from './SubjectForm'
import ClassForm from './ClassForm'

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('subjects')
  const [searchTerm, setSearchTerm] = useState('')
  const [showSubjectForm, setShowSubjectForm] = useState(false)
  const [showClassForm, setShowClassForm] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [editingClass, setEditingClass] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      await Promise.all([fetchSubjects(), fetchClasses()])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const fetchSubjects = async () => {
    const subjectsQuery = query(collection(db, 'subjects'), orderBy('name'))
    const subjectsSnapshot = await getDocs(subjectsQuery)
    const subjectsData = subjectsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setSubjects(subjectsData)
  }

  const fetchClasses = async () => {
    const classesQuery = query(collection(db, 'classes'), orderBy('grade'), orderBy('section'))
    const classesSnapshot = await getDocs(classesQuery)
    const classesData = classesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setClasses(classesData)
  }

  const handleCreateSubject = async (subjectData) => {
    try {
      await addDoc(collection(db, 'subjects'), {
        ...subjectData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      toast.success('Subject created successfully!')
      setShowSubjectForm(false)
      fetchSubjects()
    } catch (error) {
      console.error('Error creating subject:', error)
      toast.error('Failed to create subject')
    }
  }

  const handleUpdateSubject = async (subjectId, subjectData) => {
    try {
      const subjectRef = doc(db, 'subjects', subjectId)
      await updateDoc(subjectRef, {
        ...subjectData,
        updatedAt: new Date().toISOString()
      })

      toast.success('Subject updated successfully!')
      setShowSubjectForm(false)
      setEditingSubject(null)
      fetchSubjects()
    } catch (error) {
      console.error('Error updating subject:', error)
      toast.error('Failed to update subject')
    }
  }

  const handleDeleteSubject = async (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await deleteDoc(doc(db, 'subjects', subjectId))
        toast.success('Subject deleted successfully!')
        fetchSubjects()
      } catch (error) {
        console.error('Error deleting subject:', error)
        toast.error('Failed to delete subject')
      }
    }
  }

  const handleCreateClass = async (classData) => {
    try {
      await addDoc(collection(db, 'classes'), {
        ...classData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      toast.success('Class created successfully!')
      setShowClassForm(false)
      fetchClasses()
    } catch (error) {
      console.error('Error creating class:', error)
      toast.error('Failed to create class')
    }
  }

  const handleUpdateClass = async (classId, classData) => {
    try {
      const classRef = doc(db, 'classes', classId)
      await updateDoc(classRef, {
        ...classData,
        updatedAt: new Date().toISOString()
      })

      toast.success('Class updated successfully!')
      setShowClassForm(false)
      setEditingClass(null)
      fetchClasses()
    } catch (error) {
      console.error('Error updating class:', error)
      toast.error('Failed to update class')
    }
  }

  const handleDeleteClass = async (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await deleteDoc(doc(db, 'classes', classId))
        toast.success('Class deleted successfully!')
        fetchClasses()
      } catch (error) {
        console.error('Error deleting class:', error)
        toast.error('Failed to delete class')
      }
    }
  }

  const filteredSubjects = subjects.filter(subject =>
    subject.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredClasses = classes.filter(cls =>
    cls.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.grade?.toString().includes(searchTerm) ||
    cls.section?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-2xl font-bold text-gray-900">Subjects & Classes</h1>
          <p className="text-gray-600">Manage subjects and class structures</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('subjects')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'subjects'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Subjects
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'classes'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Classes
          </button>
        </nav>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
        <button
          onClick={() => activeTab === 'subjects' ? setShowSubjectForm(true) : setShowClassForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add {activeTab === 'subjects' ? 'Subject' : 'Class'}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'subjects' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => (
            <div key={subject.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                  <p className="text-sm text-gray-600">Code: {subject.code}</p>
                  {subject.description && (
                    <p className="text-sm text-gray-500 mt-1">{subject.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingSubject(subject)
                      setShowSubjectForm(true)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubject(subject.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Credits:</span>
                  <span className="font-medium">{subject.credits || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    subject.type === 'core' ? 'bg-blue-100 text-blue-800' :
                    subject.type === 'elective' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {subject.type || 'General'}
                  </span>
                </div>
                {subject.department && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Department:</span>
                    <span className="font-medium">{subject.department}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredSubjects.length === 0 && (
            <div className="col-span-full text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects found</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first subject.</p>
              <button
                onClick={() => setShowSubjectForm(true)}
                className="btn btn-primary"
              >
                Add Subject
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => (
            <div key={cls.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{cls.name}</h3>
                  <p className="text-sm text-gray-600">Grade {cls.grade} - Section {cls.section}</p>
                  {cls.description && (
                    <p className="text-sm text-gray-500 mt-1">{cls.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingClass(cls)
                      setShowClassForm(true)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClass(cls.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">{cls.capacity || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Room:</span>
                  <span className="font-medium">{cls.room || 'N/A'}</span>
                </div>
                {cls.classTeacher && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Class Teacher:</span>
                    <span className="font-medium">{cls.classTeacher}</span>
                  </div>
                )}
                {cls.subjects && cls.subjects.length > 0 && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Subjects:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {cls.subjects.slice(0, 3).map((subjectId, index) => {
                        const subject = subjects.find(s => s.id === subjectId)
                        return (
                          <span key={index} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded">
                            {subject?.code || subjectId}
                          </span>
                        )
                      })}
                      {cls.subjects.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{cls.subjects.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredClasses.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first class.</p>
              <button
                onClick={() => setShowClassForm(true)}
                className="btn btn-primary"
              >
                Add Class
              </button>
            </div>
          )}
        </div>
      )}

      {/* Subject Form Modal */}
      {showSubjectForm && (
        <SubjectForm
          subject={editingSubject}
          onSubmit={editingSubject ? 
            (data) => handleUpdateSubject(editingSubject.id, data) : 
            handleCreateSubject
          }
          onClose={() => {
            setShowSubjectForm(false)
            setEditingSubject(null)
          }}
        />
      )}

      {/* Class Form Modal */}
      {showClassForm && (
        <ClassForm
          classData={editingClass}
          subjects={subjects}
          onSubmit={editingClass ? 
            (data) => handleUpdateClass(editingClass.id, data) : 
            handleCreateClass
          }
          onClose={() => {
            setShowClassForm(false)
            setEditingClass(null)
          }}
        />
      )}
    </div>
  )
}

export default SubjectManagement
