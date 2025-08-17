import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Camera, Shield, Bell, Globe, Lock, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const TeacherProfile = () => {
  const [activeTab, setActiveTab] = useState('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [profileData, setProfileData] = useState({})
  const [editForm, setEditForm] = useState({})
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    // Mock profile data
    const mockProfile = {
      personal: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@school.edu',
        phone: '+1 (555) 123-4567',
        address: '123 Main Street, City, State 12345',
        dateOfBirth: '1985-06-15',
        joinDate: '2020-09-01',
        employeeId: 'TCH001',
        department: 'Mathematics',
        qualification: 'M.Ed in Mathematics',
        experience: '8 years',
        avatar: null
      },
      preferences: {
        language: 'en',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        weeklyReports: true,
        parentMessages: true,
        systemUpdates: false
      },
      security: {
        twoFactorEnabled: false,
        lastPasswordChange: '2024-01-15',
        loginHistory: [
          { date: '2024-03-15T08:30:00Z', device: 'Chrome on Windows', location: 'New York, NY' },
          { date: '2024-03-14T16:45:00Z', device: 'Safari on iPhone', location: 'New York, NY' },
          { date: '2024-03-14T07:20:00Z', device: 'Chrome on Windows', location: 'New York, NY' }
        ]
      }
    }

    setProfileData(mockProfile)
    setEditForm(mockProfile.personal)
  }, [])

  const handleSaveProfile = async () => {
    try {
      setProfileData(prev => ({
        ...prev,
        personal: editForm
      }))
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    try {
      // Simulate password change
      toast.success('Password changed successfully!')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setShowPasswordForm(false)
    } catch (error) {
      toast.error('Failed to change password')
    }
  }

  const handlePreferenceChange = (key, value) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }))
    toast.success('Preference updated')
  }

  const toggleTwoFactor = () => {
    setProfileData(prev => ({
      ...prev,
      security: {
        ...prev.security,
        twoFactorEnabled: !prev.security.twoFactorEnabled
      }
    }))
    toast.success(profileData.security?.twoFactorEnabled ? 'Two-factor authentication disabled' : 'Two-factor authentication enabled')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your profile and account settings</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('personal')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'personal'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'preferences'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Bell className="w-4 h-4 inline mr-2" />
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            Security
          </button>
        </nav>
      </div>

      {/* Personal Information Tab */}
      {activeTab === 'personal' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              <button
                onClick={() => {
                  if (isEditing) {
                    setEditForm(profileData.personal)
                    setIsEditing(false)
                  } else {
                    setIsEditing(true)
                  }
                }}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center"
              >
                {isEditing ? <X className="w-4 h-4 mr-1" /> : <Edit className="w-4 h-4 mr-1" />}
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Profile Picture */}
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-600" />
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {profileData.personal?.firstName} {profileData.personal?.lastName}
                </h4>
                <p className="text-gray-600">{profileData.personal?.department} Teacher</p>
                <p className="text-sm text-gray-500">Employee ID: {profileData.personal?.employeeId}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.firstName || ''}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.personal?.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.lastName || ''}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.personal?.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {profileData.personal?.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {profileData.personal?.phone}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.address || ''}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {profileData.personal?.address}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editForm.dateOfBirth || ''}
                    onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {new Date(profileData.personal?.dateOfBirth).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                <p className="text-gray-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {new Date(profileData.personal?.joinDate).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <p className="text-gray-900">{profileData.personal?.department}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                <p className="text-gray-900">{profileData.personal?.experience}</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                <p className="text-gray-900">{profileData.personal?.qualification}</p>
              </div>
            </div>

            {isEditing && (
              <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Preferences</h3>
          
          <div className="space-y-6">
            {/* General Preferences */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">General</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={profileData.preferences?.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={profileData.preferences?.timezone}
                    onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Notifications</h4>
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                  { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
                  { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive push notifications in browser' },
                  { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly performance reports' },
                  { key: 'parentMessages', label: 'Parent Messages', description: 'Get notified of new parent messages' },
                  { key: 'systemUpdates', label: 'System Updates', description: 'Receive system maintenance notifications' }
                ].map((pref) => (
                  <div key={pref.key} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium text-gray-900">{pref.label}</div>
                      <div className="text-sm text-gray-500">{pref.description}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.preferences?.[pref.key]}
                        onChange={(e) => handlePreferenceChange(pref.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Password Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Password</h3>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Change Password
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Last changed: {new Date(profileData.security?.lastPasswordChange).toLocaleDateString()}
            </p>

            {showPasswordForm && (
              <form onSubmit={handleChangePassword} className="space-y-4 border-t pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Update Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <button
                onClick={toggleTwoFactor}
                className={`px-4 py-2 rounded-lg ${
                  profileData.security?.twoFactorEnabled
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {profileData.security?.twoFactorEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Status: {profileData.security?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </p>
          </div>

          {/* Login History */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Login Activity</h3>
            <div className="space-y-3">
              {profileData.security?.loginHistory?.map((login, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{login.device}</p>
                    <p className="text-sm text-gray-500">{login.location}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(login.date).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherProfile
