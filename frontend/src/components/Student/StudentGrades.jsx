import React, { useState, useEffect } from 'react'
import { Award, TrendingUp, BarChart3, Eye, Download, Calendar } from 'lucide-react'

const StudentGrades = () => {
  const [grades, setGrades] = useState([])
  const [selectedSemester, setSelectedSemester] = useState('current')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for grades
    const mockGrades = [
      {
        id: 1,
        subject: 'Mathematics',
        teacher: 'Dr. Smith',
        assignments: [
          { name: 'Assignment 1', grade: 'A-', points: '18/20', date: '2024-01-15' },
          { name: 'Midterm Exam', grade: 'B+', points: '85/100', date: '2024-02-10' },
          { name: 'Assignment 2', grade: 'A', points: '19/20', date: '2024-02-25' }
        ],
        currentGrade: 'A-',
        gpa: 3.7
      },
      {
        id: 2,
        subject: 'Physics',
        teacher: 'Prof. Johnson',
        assignments: [
          { name: 'Lab Report 1', grade: 'B+', points: '42/50', date: '2024-01-20' },
          { name: 'Quiz 1', grade: 'A', points: '95/100', date: '2024-02-05' },
          { name: 'Midterm Exam', grade: 'B', points: '78/100', date: '2024-02-15' }
        ],
        currentGrade: 'B+',
        gpa: 3.3
      },
      {
        id: 3,
        subject: 'Chemistry',
        teacher: 'Dr. Williams',
        assignments: [
          { name: 'Lab Practical', grade: 'A', points: '48/50', date: '2024-01-25' },
          { name: 'Assignment 1', grade: 'A-', points: '17/20', date: '2024-02-08' },
          { name: 'Quiz 1', grade: 'A+', points: '100/100', date: '2024-02-20' }
        ],
        currentGrade: 'A',
        gpa: 4.0
      },
      {
        id: 4,
        subject: 'English Literature',
        teacher: 'Ms. Davis',
        assignments: [
          { name: 'Essay 1', grade: 'B+', points: '83/100', date: '2024-01-30' },
          { name: 'Presentation', grade: 'A-', points: '88/100', date: '2024-02-12' },
          { name: 'Midterm Exam', grade: 'B', points: '80/100', date: '2024-02-18' }
        ],
        currentGrade: 'B+',
        gpa: 3.3
      }
    ]

    setGrades(mockGrades)
    setLoading(false)
  }, [])

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50'
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50'
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const calculateOverallGPA = () => {
    const totalGPA = grades.reduce((sum, subject) => sum + subject.gpa, 0)
    return (totalGPA / grades.length).toFixed(2)
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
          <h1 className="text-2xl font-bold text-gray-900">My Grades</h1>
          <p className="text-gray-600">View your academic performance and progress</p>
        </div>
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="current">Current Semester</option>
          <option value="previous">Previous Semester</option>
          <option value="all">All Semesters</option>
        </select>
      </div>

      {/* GPA Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overall GPA</p>
              <p className="text-2xl font-bold text-gray-900">{calculateOverallGPA()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Subjects</p>
              <p className="text-2xl font-bold text-gray-900">{grades.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Class Rank</p>
              <p className="text-2xl font-bold text-gray-900">12/150</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Grades */}
      <div className="space-y-6">
        {grades.map((subject) => (
          <div key={subject.id} className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{subject.subject}</h3>
                  <p className="text-sm text-gray-500">Instructor: {subject.teacher}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(subject.currentGrade)}`}>
                    {subject.currentGrade}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">GPA: {subject.gpa}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Recent Assignments</h4>
              <div className="space-y-3">
                {subject.assignments.map((assignment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{assignment.name}</p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {assignment.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">{assignment.points}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getGradeColor(assignment.grade)}`}>
                        {assignment.grade}
                      </span>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StudentGrades
