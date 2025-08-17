import React, { useState, useEffect } from 'react'
import { ClipboardList, Upload, Calendar, Clock, CheckCircle, AlertCircle, FileText, Download, Eye } from 'lucide-react'
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../config/firebase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const StudentAssignments = () => {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [submissionModal, setSubmissionModal] = useState({ open: false, assignment: null })
  const [submissionFile, setSubmissionFile] = useState(null)
  const [submissionText, setSubmissionText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState('all') // all, pending, submitted, overdue

  useEffect(() => {
    fetchAssignments()
  }, [user])

  const fetchAssignments = async () => {
    try {
      // Mock data for demonstration - replace with actual Firebase query
      const mockAssignments = [
        {
          id: '1',
          title: 'Mathematics Assignment - Algebra',
          subject: 'Mathematics',
          description: 'Solve the given algebraic equations and show your work.',
          dueDate: new Date('2024-01-25'),
          assignedDate: new Date('2024-01-15'),
          maxMarks: 50,
          status: 'pending', // pending, submitted, graded
          submission: null,
          teacherName: 'Dr. Smith',
          attachments: ['algebra_problems.pdf']
        },
        {
          id: '2',
          title: 'Science Project - Solar System',
          subject: 'Science',
          description: 'Create a model of the solar system and write a report.',
          dueDate: new Date('2024-01-30'),
          assignedDate: new Date('2024-01-10'),
          maxMarks: 100,
          status: 'submitted',
          submission: {
            submittedAt: new Date('2024-01-20'),
            file: 'solar_system_project.pdf',
            text: 'Completed the solar system model with detailed report.'
          },
          teacherName: 'Ms. Johnson',
          attachments: ['solar_system_guidelines.pdf']
        },
        {
          id: '3',
          title: 'English Essay - Climate Change',
          subject: 'English',
          description: 'Write a 500-word essay on climate change impacts.',
          dueDate: new Date('2024-01-20'),
          assignedDate: new Date('2024-01-05'),
          maxMarks: 25,
          status: 'overdue',
          submission: null,
          teacherName: 'Mr. Brown',
          attachments: []
        }
      ]
      setAssignments(mockAssignments)
    } catch (error) {
      console.error('Error fetching assignments:', error)
      toast.error('Failed to load assignments')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAssignment = async () => {
    if (!submissionFile && !submissionText.trim()) {
      toast.error('Please provide either a file or text submission')
      return
    }

    setSubmitting(true)
    try {
      let fileUrl = null
      
      if (submissionFile) {
        const fileRef = ref(storage, `assignments/${user.uid}/${submissionModal.assignment.id}/${submissionFile.name}`)
        await uploadBytes(fileRef, submissionFile)
        fileUrl = await getDownloadURL(fileRef)
      }

      // Update assignment with submission
      const updatedAssignments = assignments.map(assignment => {
        if (assignment.id === submissionModal.assignment.id) {
          return {
            ...assignment,
            status: 'submitted',
            submission: {
              submittedAt: new Date(),
              file: fileUrl,
              text: submissionText,
              fileName: submissionFile?.name
            }
          }
        }
        return assignment
      })

      setAssignments(updatedAssignments)
      setSubmissionModal({ open: false, assignment: null })
      setSubmissionFile(null)
      setSubmissionText('')
      toast.success('Assignment submitted successfully!')
    } catch (error) {
      console.error('Error submitting assignment:', error)
      toast.error('Failed to submit assignment')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status, dueDate) => {
    if (status === 'submitted') return 'text-green-600 bg-green-100'
    if (status === 'graded') return 'text-blue-600 bg-blue-100'
    if (new Date() > dueDate) return 'text-red-600 bg-red-100'
    return 'text-yellow-600 bg-yellow-100'
  }

  const getStatusIcon = (status, dueDate) => {
    if (status === 'submitted') return <CheckCircle className="w-4 h-4" />
    if (new Date() > dueDate && status === 'pending') return <AlertCircle className="w-4 h-4" />
    return <Clock className="w-4 h-4" />
  }

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true
    if (filter === 'pending') return assignment.status === 'pending'
    if (filter === 'submitted') return assignment.status === 'submitted'
    if (filter === 'overdue') return new Date() > assignment.dueDate && assignment.status === 'pending'
    return true
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
          <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
          <p className="text-gray-600">View and submit your assignments</p>
        </div>
        <div className="flex space-x-2">
          {['all', 'pending', 'submitted', 'overdue'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === filterType
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        {filteredAssignments.map((assignment) => (
          <div key={assignment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                <p className="text-gray-600 mb-3">{assignment.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Subject: {assignment.subject}</span>
                  <span>Teacher: {assignment.teacherName}</span>
                  <span>Max Marks: {assignment.maxMarks}</span>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(assignment.status, assignment.dueDate)}`}>
                {getStatusIcon(assignment.status, assignment.dueDate)}
                <span>
                  {assignment.status === 'submitted' ? 'Submitted' : 
                   new Date() > assignment.dueDate && assignment.status === 'pending' ? 'Overdue' : 
                   'Pending'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500">
                <div>Assigned: {assignment.assignedDate.toLocaleDateString()}</div>
                <div className={new Date() > assignment.dueDate ? 'text-red-600 font-medium' : ''}>
                  Due: {assignment.dueDate.toLocaleDateString()}
                </div>
              </div>
              {assignment.attachments.length > 0 && (
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{assignment.attachments.length} attachment(s)</span>
                </div>
              )}
            </div>

            {assignment.submission && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-green-800 mb-2">Your Submission</h4>
                <p className="text-sm text-green-700 mb-2">
                  Submitted on: {assignment.submission.submittedAt.toLocaleDateString()}
                </p>
                {assignment.submission.text && (
                  <p className="text-sm text-green-700 mb-2">{assignment.submission.text}</p>
                )}
                {assignment.submission.file && (
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">{assignment.submission.fileName}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {assignment.attachments.map((attachment, index) => (
                  <button
                    key={index}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>{attachment}</span>
                  </button>
                ))}
              </div>
              <div className="flex space-x-2">
                <button className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg">
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                {assignment.status === 'pending' && (
                  <button
                    onClick={() => setSubmissionModal({ open: true, assignment })}
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Submit</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
          <p className="text-gray-500">
            {filter === 'all' ? 'You have no assignments at the moment.' : `No ${filter} assignments found.`}
          </p>
        </div>
      )}

      {/* Assignment Submission Modal */}
      {showSubmissionModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Submit Assignment</h3>
            <p className="text-gray-600 mb-4">{selectedAssignment.title}</p>
            
            {/* Previous Submissions */}
            {selectedAssignment.submissions && selectedAssignment.submissions.length > 0 && (
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Previous Submissions</h4>
                <div className="space-y-2">
                  {selectedAssignment.submissions.map((submission, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Version {submission.version}</p>
                          <p className="text-xs text-gray-500">Submitted: {submission.submittedAt}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {submission.feedback && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Feedback Available
                            </span>
                          )}
                          <span className={`text-xs px-2 py-1 rounded ${
                            submission.grade ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {submission.grade || 'Pending'}
                          </span>
                        </div>
                      </div>
                      {submission.feedback && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                          <p className="font-medium text-blue-900">Teacher Feedback:</p>
                          <p className="text-blue-800">{submission.feedback}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File
                </label>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept=".pdf,.doc,.docx,.txt"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments (Optional)
                </label>
                <textarea
                  value={submissionComments}
                  onChange={(e) => setSubmissionComments(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Add any comments about your submission..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowSubmissionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAssignment}
                disabled={!selectedFile}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit New Version
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentAssignments
