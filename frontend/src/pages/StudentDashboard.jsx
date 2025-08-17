import React from 'react'
import { Routes, Route } from 'react-router-dom'
import DashboardLayout from '../components/Layout/DashboardLayout'
import StudentHome from '../components/Student/StudentHome'
import StudentGrades from '../components/Student/StudentGrades'
import StudentAssignments from '../components/Student/StudentAssignments'
import StudentAttendance from '../components/Student/StudentAttendance'
import StudyBoards from '../components/Student/StudyBoards'
import StudentMessages from '../components/Student/StudentMessages'
import StudentResources from '../components/Student/StudentResources'
import StudentProfile from '../components/Student/StudentProfile'
import StudentAnnouncements from '../components/Student/StudentAnnouncements'

const StudentDashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<StudentHome />} />
        <Route path="/grades" element={<StudentGrades />} />
        <Route path="/assignments" element={<StudentAssignments />} />
        <Route path="/attendance" element={<StudentAttendance />} />
        <Route path="/study-boards" element={<StudyBoards />} />
        <Route path="/messages" element={<StudentMessages />} />
        <Route path="/resources" element={<StudentResources />} />
        <Route path="/announcements" element={<StudentAnnouncements />} />
        <Route path="/profile" element={<StudentProfile />} />
      </Routes>
    </DashboardLayout>
  )
}

export default StudentDashboard
