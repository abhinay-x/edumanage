import React from 'react'
import { Routes, Route } from 'react-router-dom'
import DashboardLayout from '../components/Layout/DashboardLayout'
import TeacherHome from '../components/Teacher/TeacherHome'
import TeacherClasses from '../components/Teacher/TeacherClasses'
import TeacherAttendance from '../components/Teacher/TeacherAttendance'
import TeacherGrades from '../components/Teacher/TeacherGrades'
import TeacherAssignments from '../components/Teacher/TeacherAssignments'
import TeacherAI from '../components/Teacher/TeacherAI'
import TeacherMessages from '../components/Teacher/TeacherMessages'
import TeacherReports from '../components/Teacher/TeacherReports'
import TeacherProfile from '../components/Teacher/TeacherProfile'

const TeacherDashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<TeacherHome />} />
        <Route path="classes" element={<TeacherClasses />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="grades" element={<TeacherGrades />} />
        <Route path="assignments" element={<TeacherAssignments />} />
        <Route path="ai-assistant" element={<TeacherAI />} />
        <Route path="messages" element={<TeacherMessages />} />
        <Route path="reports" element={<TeacherReports />} />
        <Route path="profile" element={<TeacherProfile />} />
      </Routes>
    </DashboardLayout>
  )
}

export default TeacherDashboard
