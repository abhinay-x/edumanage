import React, { useState } from 'react'
import { X, Upload, Download, AlertCircle } from 'lucide-react'
import { collection, addDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { db, auth } from '../../config/firebase'
import toast from 'react-hot-toast'

const BulkImport = ({ onClose, onImportComplete }) => {
  const [file, setFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [results, setResults] = useState(null)

  const downloadTemplate = () => {
    const csvContent = `firstName,lastName,email,role,phone,address,dateOfBirth,joiningDate
John,Doe,john.doe@example.com,teacher,+1234567890,123 Main St,1985-06-15,2024-01-15
Jane,Smith,jane.smith@example.com,student,+1234567891,456 Oak Ave,2005-03-20,2024-01-15`

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'user_import_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim())
    
    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim())
      const user = {}
      
      headers.forEach((header, i) => {
        user[header] = values[i] || ''
      })
      
      user.rowNumber = index + 2 // +2 because we start from row 2 (after header)
      return user
    })
  }

  const validateUser = (user) => {
    const errors = []
    
    if (!user.firstName) errors.push('First name is required')
    if (!user.lastName) errors.push('Last name is required')
    if (!user.email) errors.push('Email is required')
    if (!user.role || !['student', 'teacher', 'super_admin'].includes(user.role)) {
      errors.push('Role must be student, teacher, or super_admin')
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (user.email && !emailRegex.test(user.email)) {
      errors.push('Invalid email format')
    }
    
    return errors
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
      setResults(null)
    } else {
      toast.error('Please select a valid CSV file')
    }
  }

  const handleImport = async () => {
    if (!file) {
      toast.error('Please select a file first')
      return
    }

    setImporting(true)
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      try {
        const text = e.target.result
        const users = parseCSV(text)
        
        const importResults = {
          total: users.length,
          successful: 0,
          failed: 0,
          errors: []
        }

        for (const user of users) {
          try {
            const validationErrors = validateUser(user)
            
            if (validationErrors.length > 0) {
              importResults.failed++
              importResults.errors.push({
                row: user.rowNumber,
                email: user.email,
                errors: validationErrors
              })
              continue
            }

            // Create auth user with default password
            const defaultPassword = 'temp123456'
            const { user: authUser } = await createUserWithEmailAndPassword(auth, user.email, defaultPassword)
            
            // Create user document
            await addDoc(collection(db, 'users'), {
              uid: authUser.uid,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              phone: user.phone || '',
              address: user.address || '',
              dateOfBirth: user.dateOfBirth || '',
              joiningDate: user.joiningDate || new Date().toISOString().split('T')[0],
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })

            importResults.successful++
          } catch (error) {
            importResults.failed++
            importResults.errors.push({
              row: user.rowNumber,
              email: user.email,
              errors: [error.message]
            })
          }
        }

        setResults(importResults)
        
        if (importResults.successful > 0) {
          toast.success(`Successfully imported ${importResults.successful} users`)
          onImportComplete()
        }
        
        if (importResults.failed > 0) {
          toast.error(`Failed to import ${importResults.failed} users`)
        }
      } catch (error) {
        console.error('Import error:', error)
        toast.error('Failed to process file')
      } finally {
        setImporting(false)
      }
    }

    reader.readAsText(file)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Bulk Import Users</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Import Instructions</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Download the CSV template and fill in user data</li>
              <li>• Required fields: firstName, lastName, email, role</li>
              <li>• Valid roles: student, teacher, super_admin</li>
              <li>• Default password will be set to "temp123456" for all users</li>
              <li>• Users will need to change their password on first login</li>
            </ul>
          </div>

          {/* Download Template */}
          <div>
            <button
              onClick={downloadTemplate}
              className="btn btn-outline flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CSV Template
            </button>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select CSV File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="cursor-pointer text-primary-600 hover:text-primary-700"
              >
                Click to upload CSV file
              </label>
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>

          {/* Import Results */}
          {results && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Import Results</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{results.total}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{results.successful}</div>
                    <div className="text-sm text-gray-600">Successful</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{results.failed}</div>
                    <div className="text-sm text-gray-600">Failed</div>
                  </div>
                </div>
              </div>

              {results.errors.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h5 className="font-medium text-red-900 mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Import Errors
                  </h5>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {results.errors.map((error, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium text-red-800">
                          Row {error.row}: {error.email}
                        </div>
                        <ul className="ml-4 text-red-700">
                          {error.errors.map((err, i) => (
                            <li key={i}>• {err}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button onClick={onClose} className="btn btn-outline">
              Close
            </button>
            <button
              onClick={handleImport}
              disabled={!file || importing}
              className="btn btn-primary"
            >
              {importing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Importing...
                </div>
              ) : (
                'Import Users'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BulkImport
