import React, { useState, useEffect } from 'react'
import { Award, Plus, Edit, Search, Download, Calculator, TrendingUp, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'

const TeacherGrades = () => {
  const [selectedClass, setSelectedClass] = useState('')
  const [activeView, setActiveView] = useState('gradebook')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [assignments, setAssignments] = useState([])
  const [grades, setGrades] = useState({})

  const [gradeForm, setGradeForm] = useState({
    studentId: '',
    assignmentId: '',
    score: '',
    maxScore: '',
    comments: ''
  })

  useEffect(() => {
    // Mock data
    const mockClasses = [
      { id: 1, name: 'Grade 10 A - Mathematics', totalStudents: 32 },
      { id: 2, name: 'Grade 10 B - Mathematics', totalStudents: 30 }
    ]

    const mockStudents = [
      { id: 1, name: 'John Smith', rollNumber: '10A001', classId: 1, currentGPA: 3.4 },
      { id: 2, name: 'Sarah Johnson', rollNumber: '10A002', classId: 1, currentGPA: 3.8 },
      { id: 3, name: 'Michael Davis', rollNumber: '10A003', classId: 1, currentGPA: 3.1 }
    ]

    const mockAssignments = [
      { id: 1, name: 'Quiz 1 - Algebra', maxScore: 100, classId: 1 },
      { id: 2, name: 'Homework - Chapter 3', maxScore: 50, classId: 1 },
      { id: 3, name: 'Midterm Exam', maxScore: 200, classId: 1 }
    ]

    const mockGrades = {
      1: {
        1: { score: 85, maxScore: 100, letterGrade: 'B', comments: 'Good work' },
        2: { score: 45, maxScore: 50, letterGrade: 'A-', comments: 'Excellent' },
        3: { score: 175, maxScore: 200, letterGrade: 'B+', comments: 'Strong performance' }
      },
      2: {
        1: { score: 92, maxScore: 100, letterGrade: 'A-', comments: 'Excellent understanding' },
        2: { score: 48, maxScore: 50, letterGrade: 'A', comments: 'Perfect homework' }
      }
    }

    setClasses(mockClasses)
    setStudents(mockStudents)
    setAssignments(mockAssignments)
    setGrades(mockGrades)
    setSelectedClass('1')
    setLoading(false)
  }, [])

  const handleGradeSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const updatedGrades = { ...grades }
      if (!updatedGrades[gradeForm.studentId]) {
        updatedGrades[gradeForm.studentId] = {}
      }
      
      const percentage = (parseFloat(gradeForm.score) / parseFloat(gradeForm.maxScore)) * 100
      const letterGrade = getLetterGrade(percentage)
      
      updatedGrades[gradeForm.studentId][gradeForm.assignmentId] = {
        score: parseFloat(gradeForm.score),
        maxScore: parseFloat(gradeForm.maxScore),
        letterGrade,
        comments: gradeForm.comments
      }
      
      setGrades(updatedGrades)
      toast.success('Grade saved successfully!')
      resetForm()
    } catch (error) {
      toast.error('Failed to save grade')
    }
  }

  const resetForm = () => {
    setGradeForm({
      studentId: '',
      assignmentId: '',
      score: '',
      maxScore: '',
      comments: ''
    })
    setShowModal(false)
  }

  const getLetterGrade = (percentage) => {
    if (percentage >= 97) return 'A+'
    if (percentage >= 93) return 'A'
    if (percentage >= 90) return 'A-'
    if (percentage >= 87) return 'B+'
    if (percentage >= 83) return 'B'
    if (percentage >= 80) return 'B-'
    if (percentage >= 77) return 'C+'
    if (percentage >= 73) return 'C'
    if (percentage >= 70) return 'C-'
    if (percentage >= 67) return 'D+'
    if (percentage >= 65) return 'D'
    return 'F'
  }

  const getGradeColor = (letterGrade) => {
    switch (letterGrade?.charAt(0)) {
      case 'A': return 'bg-green-100 text-green-800'
      case 'B': return 'bg-blue-100 text-blue-800'
      case 'C': return 'bg-yellow-100 text-yellow-800'
      case 'D': return 'bg-orange-100 text-orange-800'
      case 'F': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const calculateStudentGPA = (studentId) => {
    const studentGrades = grades[studentId] || {}
    const gradeValues = Object.values(studentGrades)
    
    if (gradeValues.length === 0) return 0
    
    const totalPoints = gradeValues.reduce((sum, grade) => {
      const percentage = (grade.score / grade.maxScore) * 100
      let points = 0
      if (percentage >= 97) points = 4.0
      else if (percentage >= 93) points = 4.0
      else if (percentage >= 90) points = 3.7
      else if (percentage >= 87) points = 3.3
      else if (percentage >= 83) points = 3.0
      else if (percentage >= 80) points = 2.7
      else if (percentage >= 77) points = 2.3
      else if (percentage >= 73) points = 2.0
      else if (percentage >= 70) points = 1.7
      else if (percentage >= 67) points = 1.3
      else if (percentage >= 65) points = 1.0
      else points = 0
      
      return sum + points
    }, 0)
    
    return (totalPoints / gradeValues.length).toFixed(2)
  }

  const classStudents = students.filter(s => s.classId === parseInt(selectedClass))
  const classAssignments = assignments.filter(a => a.classId === parseInt(selectedClass))

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
          <h1 className="text-2xl font-bold text-gray-900">Grade Management</h1>
          <p className="text-gray-600">Manage student grades and assessments</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setActiveView('gradebook')}
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeView === 'gradebook' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Award className="w-4 h-4 mr-2" />
            Gradebook
          </button>
          <button
            onClick={() => setActiveView('analytics')}
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeView === 'analytics' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Grade
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gradebook View */}
      {activeView === 'gradebook' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Gradebook - {classes.find(c => c.id === parseInt(selectedClass))?.name}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  {classAssignments.map((assignment) => (
                    <th key={assignment.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div>{assignment.name}</div>
                      <div className="text-gray-400">({assignment.maxScore} pts)</div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current GPA
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-700">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.rollNumber}</div>
                        </div>
                      </div>
                    </td>
                    {classAssignments.map((assignment) => {
                      const grade = grades[student.id]?.[assignment.id]
                      return (
                        <td key={assignment.id} className="px-6 py-4 whitespace-nowrap text-center">
                          {grade ? (
                            <div className="space-y-1">
                              <div className="text-sm font-medium">
                                {grade.score}/{grade.maxScore}
                              </div>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getGradeColor(grade.letterGrade)}`}>
                                {grade.letterGrade}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                      )
                    })}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-medium">{calculateStudentGPA(student.id)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics View */}
      {activeView === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Performance Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Class Average GPA:</span>
                <span className="font-semibold text-lg">3.28</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Highest GPA:</span>
                <span className="font-semibold text-lg text-green-600">3.8</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Lowest GPA:</span>
                <span className="font-semibold text-lg text-red-600">2.8</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Performance</h3>
            <div className="space-y-3">
              {classAssignments.map((assignment) => {
                const assignmentGrades = Object.values(grades).map(studentGrades => studentGrades[assignment.id]).filter(Boolean)
                const average = assignmentGrades.length > 0 
                  ? (assignmentGrades.reduce((sum, grade) => sum + (grade.score / grade.maxScore * 100), 0) / assignmentGrades.length).toFixed(1)
                  : 0
                
                return (
                  <div key={assignment.id} className="p-3 border border-gray-200 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{assignment.name}</span>
                      <span className="text-sm text-gray-500">{average}% avg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${average}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Grade Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Grade</h3>
            
            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
                <select
                  value={gradeForm.studentId}
                  onChange={(e) => setGradeForm({ ...gradeForm, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Student</option>
                  {classStudents.map((student) => (
                    <option key={student.id} value={student.id}>{student.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignment</label>
                <select
                  value={gradeForm.assignmentId}
                  onChange={(e) => {
                    const assignment = classAssignments.find(a => a.id === parseInt(e.target.value))
                    setGradeForm({ 
                      ...gradeForm, 
                      assignmentId: e.target.value,
                      maxScore: assignment ? assignment.maxScore.toString() : ''
                    })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Assignment</option>
                  {classAssignments.map((assignment) => (
                    <option key={assignment.id} value={assignment.id}>{assignment.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Score</label>
                  <input
                    type="number"
                    value={gradeForm.score}
                    onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Score</label>
                  <input
                    type="number"
                    value={gradeForm.maxScore}
                    onChange={(e) => setGradeForm({ ...gradeForm, maxScore: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                <textarea
                  value={gradeForm.comments}
                  onChange={(e) => setGradeForm({ ...gradeForm, comments: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
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
                  Save Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherGrades
