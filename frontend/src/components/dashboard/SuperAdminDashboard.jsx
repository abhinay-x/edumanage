import React from 'react';
import { Shield, BookOpen, Users, GraduationCap } from 'lucide-react';

const SuperAdminDashboard = ({ user, onLogout }) => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Super Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.email}</p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">User Management</h3>
              <p className="text-gray-600">Manage roles & permissions</p>
            </div>
            <Shield className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Academic Year</h3>
              <p className="text-gray-600">Manage academic structure</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">AI Analytics</h3>
              <p className="text-gray-600">Performance insights</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Timetable Builder</h3>
              <p className="text-gray-600">AI-assisted scheduling</p>
            </div>
            <GraduationCap className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors">
            <h3 className="font-medium">Bulk Student Import</h3>
            <p className="text-sm text-gray-600">Upload CSV/Excel files</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors">
            <h3 className="font-medium">Send Announcements</h3>
            <p className="text-sm text-gray-600">Communicate with all users</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors">
            <h3 className="font-medium">Generate Reports</h3>
            <p className="text-sm text-gray-600">Export attendance & performance</p>
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default SuperAdminDashboard;
