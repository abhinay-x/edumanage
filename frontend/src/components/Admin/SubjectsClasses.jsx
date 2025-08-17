import React, { useState, useEffect } from 'react'
import { BookOpen, Plus, Edit, Trash2, Search, Users, GraduationCap, UserCheck } from 'lucide-react'
import toast from 'react-hot-toast'

const SubjectsClasses = () => {
  const [activeTab, setActiveTab] = useState('subjects')
  const [subjects, setSubjects] = useState([])
  const [classes, setClasses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    credits: '',
    description: '',
    gradeLevel: '',
    prerequisites: []
  })

  const [classForm, setClassForm] = useState({
    name: '',
    gradeLevel: '',
    section: '',
    capacity: '',
    academicYear: '2024-2025',
    classTeacher: ''
  })

  useEffect(() => {
    // Mock data
    const mockSubjects = [
      {
        id: 1,
        name: 'Mathematics',
        code: 'MATH101',
        credits: 4,
        description: 'Advanced Mathematics for Grade 10',
        gradeLevel: '10',
        prerequisites: [],
        assignedTeachers: ['Dr. Smith', 'Prof. Johnson'],
        totalStudents: 120
      },
      {
        id: 2,
        name: 'Physics',
        code: 'PHY101',
        credits: 4,
        description: 'Introduction to Physics',
        gradeLevel: '10',
        prerequisites: ['MATH101'],
        assignedTeachers: ['Dr. Wilson'],
        totalStudents: 95
      },
      {
        id: 3,
        name: 'Chemistry',
        code: 'CHEM101',
        credits: 3,
        description: 'Basic Chemistry Concepts',
        gradeLevel: '10',
        prerequisites: [],
        assignedTeachers: ['Dr. Brown'],
        totalStudents: 88
      }
    ]

    const mockClasses = [
      {
        id: 1,
        name: 'Grade 10 A',
        gradeLevel: '10',
        section: 'A',
        capacity: 35,
        currentStudents: 32,
        academicYear: '2024-2025',
        classTeacher: 'Ms. Davis',
        subjects: ['Mathematics', 'Physics', 'Chemistry', 'English']
      },
      {
        id: 2,
        name: 'Grade 10 B',
        gradeLevel: '10',
        section: 'B',
        capacity: 35,
        currentStudents: 30,
        academicYear: '2024-2025',
        classTeacher: 'Mr. Anderson',
        subjects: ['Mathematics', 'Physics', 'Chemistry', 'English']
      },
      {
        id: 3,
        name: 'Grade 11 A',
        gradeLevel: '11',
        section: 'A',
        capacity: 30,
        currentStudents: 28,
        academicYear: '2024-2025',
        classTeacher: 'Dr. Thompson',
        subjects: ['Advanced Mathematics', 'Physics', 'Chemistry', 'Biology']
      }
    ]

    const mockTeachers = [
      { id: 1, name: 'Dr. Smith', subject: 'Mathematics' },
      { id: 2, name: 'Prof. Johnson', subject: 'Mathematics' },
      { id: 3, name: 'Dr. Wilson', subject: 'Physics' },
      { id: 4, name: 'Dr. Brown', subject: 'Chemistry' },
      { id: 5, name: 'Ms. Davis', subject: 'English' },
      { id: 6, name: 'Mr. Anderson', subject: 'History' },
      { id: 7, name: 'Dr. Thompson', subject: 'Biology' }
    ]

    setSubjects(mockSubjects)
    setClasses(mockClasses)
    setTeachers(mockTeachers)
    setLoading(false)
  }, [])

  const handleSubjectSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingItem) {
        const updatedSubjects = subjects.map(subject =>
          subject.id === editingItem.id
            ? { ...subject, ...subjectForm, updatedAt: new Date().toISOString() }
            : subject
        )
        setSubjects(updatedSubjects)
        toast.success('Subject updated successfully!')
      } else {
        const newSubject = {
          id: Date.now(),
          ...subjectForm,
          assignedTeachers: [],
          totalStudents: 0,
          createdAt: new Date().toISOString()
        }
        setSubjects([...subjects, newSubject])
        toast.success('Subject created successfully!')
      }
      resetForms()
    } catch (error) {
      toast.error('Failed to save subject')
    }
  }

  const handleClassSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingItem) {
        const updatedClasses = classes.map(cls =>
          cls.id === editingItem.id
            ? { ...cls, ...classForm, name: `Grade ${classForm.gradeLevel} ${classForm.section}`, updatedAt: new Date().toISOString() }
            : cls
        )
        setClasses(updatedClasses)
        toast.success('Class updated successfully!')
      } else {
        const newClass = {
          id: Date.now(),
          ...classForm,
          name: `Grade ${classForm.gradeLevel} ${classForm.section}`,
          currentStudents: 0,
          subjects: [],
          createdAt: new Date().toISOString()
        }
        setClasses([...classes, newClass])
        toast.success('Class created successfully!')
      }
      resetForms()
    } catch (error) {
      toast.error('Failed to save class')
    }
  }

  const resetForms = () => {
    setSubjectForm({
      name: '',
      code: '',
      credits: '',
      description: '',
      gradeLevel: '',
      prerequisites: []
    })
    setClassForm({
      name: '',
      gradeLevel: '',
      section: '',
      capacity: '',
      academicYear: '2024-2025',
      classTeacher: ''
    })
    setEditingItem(null)
    setShowModal(false)
  }

  const handleEdit = (item, type) => {
    setEditingItem(item)
    if (type === 'subject') {
      setSubjectForm({
        name: item.name,
        code: item.code,
        credits: item.credits,
        description: item.description,
        gradeLevel: item.gradeLevel,
        prerequisites: item.prerequisites
      })
    } else {
      setClassForm({
        name: item.name,
        gradeLevel: item.gradeLevel,
        section: item.section,
        capacity: item.capacity,
        academicYear: item.academicYear,
        classTeacher: item.classTeacher
      })
    }
    setShowModal(true)
  }

  const handleDelete = async (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        if (type === 'subject') {
          setSubjects(subjects.filter(subject => subject.id !== id))
        } else {
          setClasses(classes.filter(cls => cls.id !== id))
        }
        toast.success(`${type} deleted successfully!`)
      } catch (error) {
        toast.error(`Failed to delete ${type}`)
      }
    }
  }

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.classTeacher.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">Subjects & Classes</h1>
          <p className="text-gray-600">Manage academic subjects and class assignments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add {activeTab === 'subjects' ? 'Subject' : 'Class'}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('subjects')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'subjects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              Subjects
            </button>
            <button
              onClick={() => setActiveTab('classes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'classes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <GraduationCap className="w-4 h-4 inline mr-2" />
              Classes
            </button>
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

          {/* Subjects Tab */}
          {activeTab === 'subjects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjects.map((subject) => (
                <div key={subject.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                      <p className="text-sm text-gray-500">{subject.code}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Grade {subject.gradeLevel}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{subject.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Credits:</span>
                      <span className="font-medium">{subject.credits}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Students:</span>
                      <span className="font-medium">{subject.totalStudents}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Teachers:</span>
                      <span className="font-medium">{subject.assignedTeachers.length}</span>
                    </div>
                  </div>

                  {subject.prerequisites.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Prerequisites:</p>
                      <div className="flex flex-wrap gap-1">
                        {subject.prerequisites.map((prereq, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {prereq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(subject, 'subject')}
                      className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(subject.id, 'subject')}
                      className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Classes Tab */}
          {activeTab === 'classes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((cls) => (
                <div key={cls.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{cls.name}</h3>
                      <p className="text-sm text-gray-500">Class Teacher: {cls.classTeacher}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {cls.academicYear}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Capacity:</span>
                      <span className="font-medium">{cls.currentStudents}/{cls.capacity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subjects:</span>
                      <span className="font-medium">{cls.subjects.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(cls.currentStudents / cls.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {cls.subjects.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Subjects:</p>
                      <div className="flex flex-wrap gap-1">
                        {cls.subjects.slice(0, 3).map((subject, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {subject}
                          </span>
                        ))}
                        {cls.subjects.length > 3 && (
                          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            +{cls.subjects.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(cls, 'class')}
                      className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cls.id, 'class')}
                      className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Edit' : 'Add'} {activeTab === 'subjects' ? 'Subject' : 'Class'}
            </h3>
            
            {activeTab === 'subjects' ? (
              <form onSubmit={handleSubjectSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
                  <input
                    type="text"
                    value={subjectForm.name}
                    onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject Code</label>
                    <input
                      type="text"
                      value={subjectForm.code}
                      onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Credits</label>
                    <input
                      type="number"
                      value={subjectForm.credits}
                      onChange={(e) => setSubjectForm({ ...subjectForm, credits: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                  <select
                    value={subjectForm.gradeLevel}
                    onChange={(e) => setSubjectForm({ ...subjectForm, gradeLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Grade</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>Grade {i + 1}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={subjectForm.description}
                    onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
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
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleClassSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                    <select
                      value={classForm.gradeLevel}
                      onChange={(e) => setClassForm({ ...classForm, gradeLevel: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Grade</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>Grade {i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                    <input
                      type="text"
                      value={classForm.section}
                      onChange={(e) => setClassForm({ ...classForm, section: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="A, B, C..."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                  <input
                    type="number"
                    value={classForm.capacity}
                    onChange={(e) => setClassForm({ ...classForm, capacity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class Teacher</label>
                  <select
                    value={classForm.classTeacher}
                    onChange={(e) => setClassForm({ ...classForm, classTeacher: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                  <select
                    value={classForm.academicYear}
                    onChange={(e) => setClassForm({ ...classForm, academicYear: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                  </select>
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
                    {editingItem ? 'Update' : 'Create'}
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

export default SubjectsClasses
