import React from 'react'
import { Routes, Route } from 'react-router-dom'
import DashboardLayout from '../components/Layout/DashboardLayout'
import SuperAdminHome from '../components/SuperAdmin/SuperAdminHome'
import UserManagement from '../components/Admin/UserManagement'
import AcademicYears from '../components/Admin/AcademicYears'
import SubjectsClasses from '../components/Admin/SubjectsClasses'
import TimetableBuilder from '../components/Admin/TimetableBuilder'
import Analytics from '../components/Admin/Analytics'
import Communications from '../components/Admin/Communications'
import Reports from '../components/Admin/Reports'
import Settings from '../components/Admin/Settings'

const SuperAdminDashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<SuperAdminHome />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="academic-years" element={<AcademicYears />} />
        <Route path="subjects" element={<SubjectsClasses />} />
        <Route path="timetable" element={<TimetableBuilder />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="communications" element={<Communications />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </DashboardLayout>
  )
}

export default SuperAdminDashboard
