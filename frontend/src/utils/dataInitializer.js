import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, collection, addDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

// Initialize demo data for EduManage
export const initializeDemoData = async () => {
  try {
    console.log('Initializing demo data...')

    // Create demo users
    await createDemoUsers()
    
    // Create academic year
    await createAcademicYear()
    
    // Create subjects
    await createSubjects()
    
    // Create classes
    await createClasses()
    
    // Create sample assignments
    await createSampleAssignments()
    
    console.log('Demo data initialized successfully!')
  } catch (error) {
    console.error('Error initializing demo data:', error)
    throw error
  }
}

const createDemoUsers = async () => {
  const demoUsers = [
    {
      email: 'admin@edumanage.com',
      password: 'demo123',
      userData: {
        firstName: 'Admin',
        lastName: 'User',
        role: 'super_admin',
        phone: '+1234567890',
        isActive: true
      }
    },
    {
      email: 'teacher@edumanage.com',
      password: 'demo123',
      userData: {
        firstName: 'John',
        lastName: 'Smith',
        role: 'teacher',
        phone: '+1234567891',
        department: 'Mathematics',
        isActive: true
      }
    },
    {
      email: 'teacher2@edumanage.com',
      password: 'demo123',
      userData: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'teacher',
        phone: '+1234567892',
        department: 'Science',
        isActive: true
      }
    },
    {
      email: 'student@edumanage.com',
      password: 'demo123',
      userData: {
        firstName: 'Emma',
        lastName: 'Wilson',
        role: 'student',
        phone: '+1234567893',
        grade: 10,
        section: 'A',
        isActive: true
      }
    },
    {
      email: 'student2@edumanage.com',
      password: 'demo123',
      userData: {
        firstName: 'Michael',
        lastName: 'Brown',
        role: 'student',
        phone: '+1234567894',
        grade: 10,
        section: 'A',
        isActive: true
      }
    }
  ]

  for (const user of demoUsers) {
    try {
      const { user: authUser } = await createUserWithEmailAndPassword(auth, user.email, user.password)
      
      await setDoc(doc(db, 'users', authUser.uid), {
        uid: authUser.uid,
        email: user.email,
        ...user.userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      console.log(`Created user: ${user.email}`)
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`User ${user.email} already exists`)
      } else {
        console.error(`Error creating user ${user.email}:`, error)
      }
    }
  }
}

const createAcademicYear = async () => {
  const academicYear = {
    name: '2024-2025',
    description: 'Academic Year 2024-2025',
    startDate: '2024-08-01',
    endDate: '2025-07-31',
    isActive: true,
    terms: [
      {
        name: 'Term 1',
        startDate: '2024-08-01',
        endDate: '2024-12-15'
      },
      {
        name: 'Term 2',
        startDate: '2025-01-15',
        endDate: '2025-05-30'
      },
      {
        name: 'Term 3',
        startDate: '2025-06-01',
        endDate: '2025-07-31'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  try {
    await addDoc(collection(db, 'academicYears'), academicYear)
    console.log('Created academic year: 2024-2025')
  } catch (error) {
    console.error('Error creating academic year:', error)
  }
}

const createSubjects = async () => {
  const subjects = [
    {
      name: 'Mathematics',
      code: 'MATH101',
      description: 'Advanced Mathematics for Grade 10',
      credits: 4,
      type: 'core',
      department: 'Mathematics'
    },
    {
      name: 'Physics',
      code: 'PHY101',
      description: 'Introduction to Physics',
      credits: 4,
      type: 'core',
      department: 'Science'
    },
    {
      name: 'Chemistry',
      code: 'CHEM101',
      description: 'Basic Chemistry Concepts',
      credits: 4,
      type: 'core',
      department: 'Science'
    },
    {
      name: 'English',
      code: 'ENG101',
      description: 'English Language and Literature',
      credits: 3,
      type: 'core',
      department: 'Languages'
    },
    {
      name: 'History',
      code: 'HIST101',
      description: 'World History',
      credits: 3,
      type: 'core',
      department: 'Social Studies'
    },
    {
      name: 'Computer Science',
      code: 'CS101',
      description: 'Introduction to Programming',
      credits: 3,
      type: 'elective',
      department: 'Technology'
    }
  ]

  for (const subject of subjects) {
    try {
      await addDoc(collection(db, 'subjects'), {
        ...subject,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      console.log(`Created subject: ${subject.name}`)
    } catch (error) {
      console.error(`Error creating subject ${subject.name}:`, error)
    }
  }
}

const createClasses = async () => {
  const classes = [
    {
      name: 'Grade 10 - A',
      grade: 10,
      section: 'A',
      capacity: 30,
      room: 'Room 101',
      classTeacher: 'John Smith',
      description: 'Grade 10 Section A - Science Stream'
    },
    {
      name: 'Grade 10 - B',
      grade: 10,
      section: 'B',
      capacity: 30,
      room: 'Room 102',
      classTeacher: 'Sarah Johnson',
      description: 'Grade 10 Section B - Commerce Stream'
    },
    {
      name: 'Grade 11 - A',
      grade: 11,
      section: 'A',
      capacity: 25,
      room: 'Room 201',
      classTeacher: 'Michael Davis',
      description: 'Grade 11 Section A - Science Stream'
    },
    {
      name: 'Grade 9 - A',
      grade: 9,
      section: 'A',
      capacity: 35,
      room: 'Room 001',
      classTeacher: 'Lisa Anderson',
      description: 'Grade 9 Section A'
    }
  ]

  for (const classData of classes) {
    try {
      await addDoc(collection(db, 'classes'), {
        ...classData,
        subjects: [], // Will be populated later
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      console.log(`Created class: ${classData.name}`)
    } catch (error) {
      console.error(`Error creating class ${classData.name}:`, error)
    }
  }
}

const createSampleAssignments = async () => {
  const assignments = [
    {
      title: 'Algebra Quiz',
      description: 'Quiz on algebraic expressions and equations',
      subject: 'Mathematics',
      classId: 'grade-10-a', // This would be actual class ID in real scenario
      dueDate: '2024-08-25',
      totalPoints: 100,
      instructions: 'Complete all questions. Show your work for partial credit.',
      status: 'active'
    },
    {
      title: 'Physics Lab Report',
      description: 'Report on pendulum experiment',
      subject: 'Physics',
      classId: 'grade-10-a',
      dueDate: '2024-08-30',
      totalPoints: 50,
      instructions: 'Submit a detailed lab report with observations and conclusions.',
      status: 'active'
    },
    {
      title: 'History Essay',
      description: 'Essay on World War II causes',
      subject: 'History',
      classId: 'grade-10-b',
      dueDate: '2024-09-05',
      totalPoints: 75,
      instructions: 'Write a 1000-word essay analyzing the causes of World War II.',
      status: 'active'
    }
  ]

  for (const assignment of assignments) {
    try {
      await addDoc(collection(db, 'assignments'), {
        ...assignment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      console.log(`Created assignment: ${assignment.title}`)
    } catch (error) {
      console.error(`Error creating assignment ${assignment.title}:`, error)
    }
  }
}

// Sample data for testing
export const sampleAttendanceData = [
  {
    classId: 'grade-10-a',
    date: '2024-08-17',
    records: [
      { studentId: 'student1', status: 'present', markedBy: 'teacher1' },
      { studentId: 'student2', status: 'present', markedBy: 'teacher1' },
      { studentId: 'student3', status: 'absent', markedBy: 'teacher1' },
      { studentId: 'student4', status: 'late', markedBy: 'teacher1' }
    ]
  }
]

export const sampleGradeData = [
  {
    studentId: 'student1',
    classId: 'grade-10-a',
    subjectId: 'math101',
    assignmentId: 'assignment1',
    points: 92,
    maxPoints: 100,
    grade: 'A-',
    feedback: 'Excellent work on algebraic concepts',
    gradedBy: 'teacher1'
  },
  {
    studentId: 'student2',
    classId: 'grade-10-a',
    subjectId: 'math101',
    assignmentId: 'assignment1',
    points: 87,
    maxPoints: 100,
    grade: 'B+',
    feedback: 'Good understanding, minor calculation errors',
    gradedBy: 'teacher1'
  }
]
