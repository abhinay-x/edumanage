import { useState, useEffect } from 'react'
import { 
  getCollection, 
  getDocument, 
  createDocument, 
  updateDocument, 
  deleteDocument,
  subscribeToCollection,
  subscribeToDocument
} from '../services/firebaseService'

// Custom hook for Firestore operations
export const useFirestore = (collectionName) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async (queryConstraints = []) => {
    setLoading(true)
    setError(null)
    try {
      const result = await getCollection(collectionName, queryConstraints)
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addDocument = async (documentData) => {
    setError(null)
    try {
      const docId = await createDocument(collectionName, documentData)
      await fetchData() // Refresh data
      return docId
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const updateDoc = async (docId, documentData) => {
    setError(null)
    try {
      await updateDocument(collectionName, docId, documentData)
      await fetchData() // Refresh data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const deleteDoc = async (docId) => {
    setError(null)
    try {
      await deleteDocument(collectionName, docId)
      await fetchData() // Refresh data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    data,
    loading,
    error,
    fetchData,
    addDocument,
    updateDoc,
    deleteDoc
  }
}

// Hook for real-time document subscription
export const useDocument = (collectionName, docId) => {
  const [document, setDocument] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!docId) {
      setDocument(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = subscribeToDocument(
      collectionName,
      docId,
      (doc) => {
        setDocument(doc)
        setLoading(false)
        setError(null)
      }
    )

    return () => unsubscribe()
  }, [collectionName, docId])

  return { document, loading, error }
}

// Hook for real-time collection subscription
export const useCollection = (collectionName, queryConstraints = []) => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    const unsubscribe = subscribeToCollection(
      collectionName,
      (docs) => {
        setDocuments(docs)
        setLoading(false)
        setError(null)
      },
      queryConstraints
    )

    return () => unsubscribe()
  }, [collectionName, JSON.stringify(queryConstraints)])

  return { documents, loading, error }
}

// Specialized hooks for EduManage entities

export const useUsers = (role = null) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        let result
        if (role) {
          const { getUsersByRole } = await import('../services/firebaseService')
          result = await getUsersByRole(role)
        } else {
          result = await getCollection('users')
        }
        setUsers(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [role])

  return { users, loading, error, refetch: () => window.location.reload() }
}

export const useAcademicYears = () => {
  const { documents: academicYears, loading, error } = useCollection('academicYears', [
    { field: 'startDate', operator: 'desc' }
  ])

  return { academicYears, loading, error }
}

export const useSubjects = () => {
  const { documents: subjects, loading, error } = useCollection('subjects', [
    { field: 'name', operator: 'asc' }
  ])

  return { subjects, loading, error }
}

export const useClasses = () => {
  const { documents: classes, loading, error } = useCollection('classes', [
    { field: 'grade', operator: 'asc' },
    { field: 'section', operator: 'asc' }
  ])

  return { classes, loading, error }
}

export const useAssignments = (teacherId = null, classId = null) => {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true)
      try {
        let result
        if (teacherId) {
          const { getAssignmentsByTeacher } = await import('../services/firebaseService')
          result = await getAssignmentsByTeacher(teacherId)
        } else if (classId) {
          const { getAssignmentsByClass } = await import('../services/firebaseService')
          result = await getAssignmentsByClass(classId)
        } else {
          result = await getCollection('assignments')
        }
        setAssignments(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [teacherId, classId])

  return { assignments, loading, error }
}

export const useAttendance = (classId = null, studentId = null, dateRange = null) => {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true)
      try {
        let result
        if (classId && dateRange) {
          const { getAttendanceByClass } = await import('../services/firebaseService')
          result = await getAttendanceByClass(classId, dateRange.start, dateRange.end)
        } else if (studentId && dateRange) {
          const { getStudentAttendance } = await import('../services/firebaseService')
          result = await getStudentAttendance(studentId, dateRange.start, dateRange.end)
        } else {
          result = await getCollection('attendance')
        }
        setAttendance(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (dateRange) {
      fetchAttendance()
    }
  }, [classId, studentId, dateRange])

  return { attendance, loading, error }
}

export const useGrades = (studentId = null, classId = null) => {
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true)
      try {
        let result
        if (studentId) {
          const { getGradesByStudent } = await import('../services/firebaseService')
          const { getActiveAcademicYear } = await import('../services/firebaseService')
          const activeYear = await getActiveAcademicYear()
          result = await getGradesByStudent(studentId, activeYear?.id)
        } else if (classId) {
          const { getGradesByClass } = await import('../services/firebaseService')
          result = await getGradesByClass(classId)
        } else {
          result = await getCollection('grades')
        }
        setGrades(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchGrades()
  }, [studentId, classId])

  return { grades, loading, error }
}

export const useMessages = (userId) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) return

    const fetchMessages = async () => {
      setLoading(true)
      try {
        const { getMessagesByUser } = await import('../services/firebaseService')
        const result = await getMessagesByUser(userId)
        setMessages(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [userId])

  return { messages, loading, error }
}

export const useAnnouncements = (targetAudience = null) => {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true)
      try {
        const { getActiveAnnouncements } = await import('../services/firebaseService')
        const result = await getActiveAnnouncements(targetAudience)
        setAnnouncements(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncements()
  }, [targetAudience])

  return { announcements, loading, error }
}
