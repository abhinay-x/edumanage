import React from 'react'
import { Settings as SettingsIcon, Shield, Database } from 'lucide-react'

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure system settings and preferences</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <SettingsIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">System Settings</h3>
        <p className="text-gray-500 mb-4">
          Configure institution settings, security preferences, and system parameters.
        </p>
        <button className="btn btn-primary">
          Configure Settings
        </button>
      </div>
    </div>
  )
}

export default Settings
