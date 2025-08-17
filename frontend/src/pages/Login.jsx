import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Users, GraduationCap, Eye, EyeOff } from 'lucide-react'
import PublicNavbar from '../components/shared/PublicNavbar'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isResetMode, setIsResetMode] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const { signin, resetPassword, user } = useAuth()
  const navigate = useNavigate()
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && user.role) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      if (isResetMode) {
        await resetPassword(data.email)
        setIsResetMode(false)
        reset()
      } else {
        await signin(data.email, data.password, rememberMe)
        // No manual redirect - let AuthContext handle it
      }
    } catch (error) {
      console.error('Authentication error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-600 p-3 rounded-full">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">EduManage</h2>
          <p className="text-gray-600">Comprehensive Education Management System</p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <Users className="w-6 h-6 text-primary-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600">User Management</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <GraduationCap className="w-6 h-6 text-primary-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Academic Tracking</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <BookOpen className="w-6 h-6 text-primary-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600">AI-Powered Tools</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className="input w-full"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {!isResetMode && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="input w-full pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            )}

            {!isResetMode && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Keep me signed in
                  </label>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">
                    {rememberMe ? 'Stays signed in until logout' : 'Session expires when browser closes'}
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full h-12 text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  {isResetMode ? 'Sending Reset Email...' : 'Signing In...'}
                </div>
              ) : (
                isResetMode ? 'Send Reset Email' : 'Sign In'
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(!isResetMode)
                  reset()
                }}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                {isResetMode ? 'Back to Sign In' : 'Forgot Password?'}
              </button>
            </div>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Credentials</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-medium">Super Admin:</span>
              <span className="text-gray-600">admin@gmail.com</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-medium">Teacher:</span>
              <span className="text-gray-600">teacher@gmail.com</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-medium">Student:</span>
              <span className="text-gray-600">student@gmail.com</span>
            </div>
            <div className="text-center text-gray-500 text-xs mt-2">
              Password: teacher123(for teacher), admin123(for admin), student123(for student) (for all demo accounts)
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Login
