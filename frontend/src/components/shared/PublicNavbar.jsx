import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Menu, X } from 'lucide-react'

const PublicNavbar = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">EduManage</span>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="/#features" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Features
              </a>
              <a href="/#testimonials" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Testimonials
              </a>
              <a href="/#pricing" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Pricing
              </a>
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <a href="/#features" className="text-gray-600 hover:text-blue-600 block px-3 py-2 text-base font-medium">
              Features
            </a>
            <a href="/#testimonials" className="text-gray-600 hover:text-blue-600 block px-3 py-2 text-base font-medium">
              Testimonials
            </a>
            <a href="/#pricing" className="text-gray-600 hover:text-blue-600 block px-3 py-2 text-base font-medium">
              Pricing
            </a>
            <button
              onClick={() => navigate('/login')}
              className="w-full text-left bg-blue-600 text-white px-3 py-2 text-base font-medium hover:bg-blue-700 transition-colors rounded-lg mt-2"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default PublicNavbar
