import React, { useState, useEffect } from 'react'
import { FileText, Plus, Edit, Trash2, Eye, Download, Upload, Calendar, Clock, Users, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const TeacherAssignments = () => {
  const [activeView, setActiveView] = useState('list')
  const [showModal, setShowModal] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [loading, setLoading] = useState(true)

  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])

  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    classId: '',
    dueDate: '',
    dueTime: '',
    maxScore: '',
    category: 'homework',
    instructions: '',
    attachments: [],
    allowLateSubmissions: true,
    latePenalty: 10
  })

  useEffect(() => {
    // Mock data
    const mockClasses = [
      { id: 1, name: 'Grade 10 A - Mathematics', totalStudents: 32 },
      { id: 2, name: 'Grade 10 B - Mathematics', totalStudents: 30 }
    ]

    const mockStudents = [
      { id: 1, name: 'John Smith', rollNumber: '10A001', classId: 1 },
      { id: 2, name: 'Sarah Johnson', rollNumber: '10A002', classId: 1 },
      { id: 3, name: 'Michael Davis', rollNumber: '10A003', classId: 1 },
      { id: 4, name: 'Emily Wilson', rollNumber: '10A004', classId: 1 }
    ]

    const mockAssignments = [
      {
        id: 1,
        title: 'Algebra Problem Set 1',
        description: 'Complete problems 1-20 from Chapter 3',
        classId: 1,
        className: 'Grade 10 A - Mathematics',
        dueDate: '2024-03-15',
        dueTime: '23:59',
        maxScore: 100,
        category: 'homework',
        status: 'active',
        createdAt: '2024-03-01',
        submissionCount: 28,
        totalStudents: 32,
        allowLateSubmissions: true,
        latePenalty: 10
      },
      {
        id: 2,
        title: 'Geometry Quiz',
        description: 'Quiz on triangles and quadrilaterals',
        classId: 1,
        className: 'Grade 10 A - Mathematics',
        dueDate: '2024-03-10',
        dueTime: '14:30',
        maxScore: 50,
        category: 'quiz',
        status: 'completed',
        createdAt: '2024-02-25',
        submissionCount: 32,
        totalStudents: 32,
        allowLateSubmissions: false,
        latePenalty: 0
      },
      {
        id: 3,
        title: 'Research Project: Famous Mathematicians',
        description: 'Research and present on a famous mathematician',
        classId: 1,
        className: 'Grade 10 A - Mathematics',
        dueDate: '2024-03-25',
        dueTime: '23:59',
        maxScore: 200,
        category: 'project',
        status: 'active',
        createdAt: '2024-03-05',
        submissionCount: 15,
        totalStudents: 32,
        allowLateSubmissions: true,
        latePenalty: 5
      }
    ]

    const mockSubmissions = [
      {
        id: 1,
        assignmentId: 1,
        studentId: 1,
        studentName: 'John Smith',
        submittedAt: '2024-03-14T10:30:00Z',
        status: 'submitted',
        isLate: false,
        grade: null,
        feedback: '',
        attachments: ['homework1_john.pdf']
      },
      {
        id: 2,
        assignmentId: 1,
        studentId: 2,
        studentName: 'Sarah Johnson',
        submittedAt: '2024-03-13T15:45:00Z',
        status: 'graded',
        isLate: false,
        grade: 95,
        feedback: 'Excellent work! Clear solutions and good explanations.',
        attachments: ['homework1_sarah.pdf']
      },
      {
        id: 3,
        assignmentId: 1,
        studentId: 3,
        studentName: 'Michael Davis',
        submittedAt: null,
        status: 'missing',
        isLate: true,
        grade: null,
        feedback: '',
        attachments: []
      }
    ]

    setClasses(mockClasses)
    setStudents(mockStudents)
    setAssignments(mockAssignments)
    setSubmissions(mockSubmissions)
    setLoading(false)
  }, [])

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const newAssignment = {
        id: Date.now(),
        ...assignmentForm,
        classId: parseInt(assignmentForm.classId),
        className: classes.find(c => c.id === parseInt(assignmentForm.classId))?.name,
        maxScore: parseInt(assignmentForm.maxScore),
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        submissionCount: 0,
        totalStudents: classes.find(c => c.id === parseInt(assignmentForm.classId))?.totalStudents || 0
      }

      if (editingAssignment) {
        setAssignments(prev => prev.map(a => a.id === editingAssignment.id ? { ...newAssignment, id: editingAssignment.id } : a))
        toast.success('Assignment updated successfully!')
      } else {
        setAssignments(prev => [newAssignment, ...prev])
        toast.success('Assignment created successfully!')
      }

      resetForm()
    } catch (error) {
      toast.error('Failed to save assignment')
    }
  }

  const resetForm = () => {
    setAssignmentForm({
      title: '',
      description: '',
      classId: '',
      dueDate: '',
      dueTime: '',
      maxScore: '',
      category: 'homework',
      instructions: '',
      attachments: [],
      allowLateSubmissions: true,
      latePenalty: 10
    })
    setEditingAssignment(null)
    setShowModal(false)
  }

  const handleEdit = (assignment) => {
    setAssignmentForm({
      title: assignment.title,
      description: assignment.description,
      classId: assignment.classId.toString(),
      dueDate: assignment.dueDate,
      dueTime: assignment.dueTime,
      maxScore: assignment.maxScore.toString(),
      category: assignment.category,
      instructions: assignment.instructions || '',
      attachments: assignment.attachments || [],
      allowLateSubmissions: assignment.allowLateSubmissions,
      latePenalty: assignment.latePenalty
    })
    setEditingAssignment(assignment)
    setShowModal(true)
  }

  const handleDelete = (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      setAssignments(prev => prev.filter(a => a.id !== assignmentId))
      toast.success('Assignment deleted successfully!')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'homework': return 'bg-blue-100 text-blue-800'
      case 'quiz': return 'bg-yellow-100 text-yellow-800'
      case 'exam': return 'bg-red-100 text-red-800'
      case 'project': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSubmissionStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'graded': return 'bg-green-100 text-green-800'
      case 'missing': return 'bg-red-100 text-red-800'
      case 'late': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSubmissionIcon = (status) => {
    switch (status) {
      case 'submitted': return <Upload className="w-4 h-4" />
      case 'graded': return <CheckCircle className="w-4 h-4" />
      case 'missing': return <XCircle className="w-4 h-4" />
      case 'late': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const assignmentSubmissions = submissions.filter(s => s.assignmentId === selectedAssignment?.id)

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
          <h1 className="text-2xl font-bold text-gray-900">Assignment Management</h1>
          <p className="text-gray-600">Create and manage class assignments</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setActiveView('list')}
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeView === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            Assignments
          </button>
          <button
            onClick={() => setActiveView('submissions')}
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeView === 'submissions' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Upload className="w-4 h-4 mr-2" />
            Submissions
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Assignment
          </button>
        </div>
      </div>

      {/* Assignment List View */}
      {activeView === 'list' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Assignments</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{assignment.title}</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${getCategoryColor(assignment.category)}`}>
                        {assignment.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{assignment.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {assignment.className}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {assignment.dueTime}
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        {assignment.maxScore} points
                      </div>
                    </div>
                    <div className="mt-3 flex items-center space-x-4 text-sm">
                      <span className="text-green-600 font-medium">
                        {assignment.submissionCount}/{assignment.totalStudents} submitted
                      </span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(assignment.submissionCount / assignment.totalStudents) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedAssignment(assignment)
                        setActiveView('submissions')
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="View Submissions"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(assignment)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                      title="Edit Assignment"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(assignment.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Delete Assignment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submissions View */}
      {activeView === 'submissions' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedAssignment ? `Submissions - ${selectedAssignment.title}` : 'All Submissions'}
                </h3>
                {selectedAssignment && (
                  <p className="text-sm text-gray-500 mt-1">
                    Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()} at {selectedAssignment.dueTime}
                  </p>
                )}
              </div>
              {selectedAssignment && (
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  View All
                </button>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(selectedAssignment ? assignmentSubmissions : submissions).map((submission) => {
                  const assignment = assignments.find(a => a.id === submission.assignmentId)
                  return (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-700">
                                {submission.studentName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{submission.studentName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{assignment?.title}</div>
                        <div className="text-sm text-gray-500">{assignment?.className}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded ${getSubmissionStatusColor(submission.status)}`}>
                          {getSubmissionIcon(submission.status)}
                          <span className="ml-1 capitalize">{submission.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {submission.grade !== null ? `${submission.grade}/${assignment?.maxScore}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {submission.attachments.length > 0 && (
                            <button className="text-blue-600 hover:text-blue-900">
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          <button className="text-indigo-600 hover:text-indigo-900">
                            Grade
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
            </h3>
            
            <form onSubmit={handleAssignmentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Title</label>
                <input
                  type="text"
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <select
                    value={assignmentForm.classId}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, classId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={assignmentForm.category}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="homework">Homework</option>
                    <option value="quiz">Quiz</option>
                    <option value="exam">Exam</option>
                    <option value="project">Project</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={assignmentForm.dueDate}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Time</label>
                  <input
                    type="time"
                    value={assignmentForm.dueTime}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, dueTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Score</label>
                  <input
                    type="number"
                    value={assignmentForm.maxScore}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, maxScore: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
                <textarea
                  value={assignmentForm.instructions}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, instructions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Detailed instructions for students..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowLate"
                    checked={assignmentForm.allowLateSubmissions}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, allowLateSubmissions: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allowLate" className="ml-2 block text-sm text-gray-700">
                    Allow Late Submissions
                  </label>
                </div>
                {assignmentForm.allowLateSubmissions && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Late Penalty (%)</label>
                    <input
                      type="number"
                      value={assignmentForm.latePenalty}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, latePenalty: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="100"
                    />
                  </div>
                )}
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
                  {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherAssignments
