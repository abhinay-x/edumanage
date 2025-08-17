import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore'
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage'
import { db, storage } from '../config/firebase'

// Generic CRUD operations
export const createDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error)
    throw error
  }
}

export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      return null
    }
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error)
    throw error
  }
}

export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error)
    throw error
  }
}

export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error)
    throw error
  }
}

export const getCollection = async (collectionName, queryConstraints = []) => {
  try {
    const collectionRef = collection(db, collectionName)
    const q = queryConstraints.length > 0 ? query(collectionRef, ...queryConstraints) : collectionRef
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error)
    throw error
  }
}

// Real-time listeners
export const subscribeToCollection = (collectionName, callback, queryConstraints = []) => {
  const collectionRef = collection(db, collectionName)
  const q = queryConstraints.length > 0 ? query(collectionRef, ...queryConstraints) : collectionRef
  
  return onSnapshot(q, (querySnapshot) => {
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(documents)
  }, (error) => {
    console.error(`Error in subscription to ${collectionName}:`, error)
  })
}

export const subscribeToDocument = (collectionName, docId, callback) => {
  const docRef = doc(db, collectionName, docId)
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() })
    } else {
      callback(null)
    }
  }, (error) => {
    console.error(`Error in document subscription:`, error)
  })
}

// File upload utilities
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

export const deleteFile = async (path) => {
  try {
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

// Batch operations
export const batchWrite = async (operations) => {
  try {
    const batch = writeBatch(db)
    
    operations.forEach(operation => {
      const { type, collection: collectionName, id, data } = operation
      const docRef = doc(db, collectionName, id)
      
      switch (type) {
        case 'create':
          batch.set(docRef, {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
          break
        case 'update':
          batch.update(docRef, {
            ...data,
            updatedAt: serverTimestamp()
          })
          break
        case 'delete':
          batch.delete(docRef)
          break
        default:
          throw new Error(`Unknown batch operation type: ${type}`)
      }
    })
    
    await batch.commit()
  } catch (error) {
    console.error('Error in batch write:', error)
    throw error
  }
}

// Specific service functions for EduManage

// User Management
export const getUsersByRole = async (role) => {
  return getCollection('users', [where('role', '==', role), orderBy('firstName')])
}

export const getActiveUsers = async () => {
  return getCollection('users', [where('isActive', '==', true)])
}

// Academic Year Management
export const getActiveAcademicYear = async () => {
  const years = await getCollection('academicYears', [where('isActive', '==', true), limit(1)])
  return years.length > 0 ? years[0] : null
}

// Class and Subject Management
export const getClassesByGrade = async (grade) => {
  return getCollection('classes', [where('grade', '==', grade), orderBy('section')])
}

export const getSubjectsByDepartment = async (department) => {
  return getCollection('subjects', [where('department', '==', department)])
}

// Enrollment Management
export const getStudentEnrollments = async (studentId) => {
  return getCollection('enrollments', [where('studentId', '==', studentId)])
}

export const getClassEnrollments = async (classId) => {
  return getCollection('enrollments', [where('classId', '==', classId)])
}

export const enrollStudent = async (studentId, classId, academicYearId) => {
  return createDocument('enrollments', {
    studentId,
    classId,
    academicYearId,
    enrollmentDate: new Date().toISOString(),
    status: 'active'
  })
}

// Assignment Management
export const getAssignmentsByClass = async (classId) => {
  return getCollection('assignments', [
    where('classId', '==', classId), 
    orderBy('dueDate', 'desc')
  ])
}

export const getAssignmentsByTeacher = async (teacherId) => {
  return getCollection('assignments', [
    where('teacherId', '==', teacherId), 
    orderBy('createdAt', 'desc')
  ])
}

export const submitAssignment = async (assignmentId, studentId, submissionData) => {
  return createDocument('assignmentSubmissions', {
    assignmentId,
    studentId,
    ...submissionData,
    submittedAt: serverTimestamp(),
    status: 'submitted'
  })
}

// Attendance Management
export const markAttendance = async (classId, date, attendanceRecords) => {
  const operations = attendanceRecords.map(record => ({
    type: 'create',
    collection: 'attendance',
    id: `${classId}_${record.studentId}_${date}`,
    data: {
      classId,
      studentId: record.studentId,
      date,
      status: record.status, // present, absent, late
      markedBy: record.markedBy,
      notes: record.notes || ''
    }
  }))
  
  return batchWrite(operations)
}

export const getAttendanceByClass = async (classId, startDate, endDate) => {
  return getCollection('attendance', [
    where('classId', '==', classId),
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date', 'desc')
  ])
}

export const getStudentAttendance = async (studentId, startDate, endDate) => {
  return getCollection('attendance', [
    where('studentId', '==', studentId),
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date', 'desc')
  ])
}

// Grade Management
export const addGrade = async (gradeData) => {
  return createDocument('grades', gradeData)
}

export const getGradesByStudent = async (studentId, academicYearId) => {
  return getCollection('grades', [
    where('studentId', '==', studentId),
    where('academicYearId', '==', academicYearId),
    orderBy('createdAt', 'desc')
  ])
}

export const getGradesByClass = async (classId, subjectId) => {
  const constraints = [where('classId', '==', classId)]
  if (subjectId) {
    constraints.push(where('subjectId', '==', subjectId))
  }
  constraints.push(orderBy('createdAt', 'desc'))
  
  return getCollection('grades', constraints)
}

// Messaging System
export const sendMessage = async (messageData) => {
  return createDocument('messages', {
    ...messageData,
    sentAt: serverTimestamp(),
    isRead: false
  })
}

export const getMessagesByUser = async (userId) => {
  return getCollection('messages', [
    where('recipientId', '==', userId),
    orderBy('sentAt', 'desc')
  ])
}

export const markMessageAsRead = async (messageId) => {
  return updateDocument('messages', messageId, { isRead: true })
}

// Announcements
export const createAnnouncement = async (announcementData) => {
  return createDocument('announcements', {
    ...announcementData,
    publishedAt: serverTimestamp(),
    isActive: true
  })
}

export const getActiveAnnouncements = async (targetAudience = null) => {
  const constraints = [where('isActive', '==', true), orderBy('publishedAt', 'desc')]
  if (targetAudience) {
    constraints.splice(1, 0, where('targetAudience', 'array-contains', targetAudience))
  }
  
  return getCollection('announcements', constraints)
}

// Study Boards
export const createStudyBoard = async (boardData) => {
  return createDocument('studyBoards', boardData)
}

export const getStudyBoardsByStudent = async (studentId) => {
  return getCollection('studyBoards', [
    where('members', 'array-contains', studentId),
    orderBy('createdAt', 'desc')
  ])
}

export const joinStudyBoard = async (boardId, studentId) => {
  const boardRef = doc(db, 'studyBoards', boardId)
  const boardDoc = await getDoc(boardRef)
  
  if (boardDoc.exists()) {
    const currentMembers = boardDoc.data().members || []
    if (!currentMembers.includes(studentId)) {
      await updateDoc(boardRef, {
        members: [...currentMembers, studentId],
        updatedAt: serverTimestamp()
      })
    }
  }
}

// Analytics and Reports
export const getAttendanceStats = async (classId, startDate, endDate) => {
  const attendance = await getAttendanceByClass(classId, startDate, endDate)
  
  const stats = {
    totalDays: 0,
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
    attendanceRate: 0
  }
  
  attendance.forEach(record => {
    stats.totalDays++
    switch (record.status) {
      case 'present':
        stats.presentCount++
        break
      case 'absent':
        stats.absentCount++
        break
      case 'late':
        stats.lateCount++
        break
    }
  })
  
  stats.attendanceRate = stats.totalDays > 0 ? 
    ((stats.presentCount + stats.lateCount) / stats.totalDays) * 100 : 0
  
  return stats
}

export const getGradeStats = async (studentId, academicYearId) => {
  const grades = await getGradesByStudent(studentId, academicYearId)
  
  if (grades.length === 0) return null
  
  const totalPoints = grades.reduce((sum, grade) => sum + (grade.points || 0), 0)
  const averageGrade = totalPoints / grades.length
  
  return {
    totalAssignments: grades.length,
    averageGrade,
    highestGrade: Math.max(...grades.map(g => g.points || 0)),
    lowestGrade: Math.min(...grades.map(g => g.points || 0)),
    grades
  }
}
