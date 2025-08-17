import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  BookOpen, 
  Award, 
  BarChart3, 
  Shield, 
  Clock, 
  Smartphone,
  Star,
  Check,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  UserCheck,
  FileText,
  Brain,
  MessageSquare,
  Play,
  GraduationCap,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react'
import PublicNavbar from '../components/shared/PublicNavbar'

const LandingPage = () => {
  const navigate = useNavigate()
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const features = [
    {
      icon: Users,
      title: 'Complete User Management',
      description: 'Comprehensive role-based access for administrators, teachers, and students with advanced user management capabilities.',
      color: 'bg-blue-500'
    },
    {
      icon: BookOpen,
      title: 'Smart Class Management',
      description: 'Intuitive class creation, student enrollment, and academic year management with automated workflows.',
      color: 'bg-green-500'
    },
    {
      icon: Users,
      title: 'Advanced Attendance Tracking',
      description: 'One-click attendance marking, bulk operations, pattern analysis, and automated parent notifications.',
      color: 'bg-purple-500'
    },
    {
      icon: Award,
      title: 'Intelligent Grade Management',
      description: 'Multiple grading scales, weighted calculations, grade templates, and comprehensive analytics.',
      color: 'bg-yellow-500'
    },
    {
      icon: FileText,
      title: 'Assignment & Submission Hub',
      description: 'Create assignments, track submissions, manage deadlines, and provide detailed feedback.',
      color: 'bg-red-500'
    },
    {
      icon: Brain,
      title: 'AI Teaching Assistant',
      description: 'AI-powered lesson plan generation, performance insights, and personalized teaching recommendations.',
      color: 'bg-indigo-500'
    },
    {
      icon: MessageSquare,
      title: 'Communication Center',
      description: 'Seamless messaging between teachers, students, and parents with priority levels and notifications.',
      color: 'bg-pink-500'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics & Reports',
      description: 'Comprehensive reporting system with customizable templates and data-driven insights.',
      color: 'bg-teal-500'
    }
  ]

  const testimonials = [
    {
      name: 'Dr. Sarah Mitchell',
      role: 'Principal, Lincoln High School',
      content: 'EduManage has transformed how we manage our school. The comprehensive features and intuitive interface have improved efficiency across all departments.',
      rating: 5,
      avatar: null
    },
    {
      name: 'Michael Rodriguez',
      role: 'Mathematics Teacher',
      content: 'The AI teaching assistant and grade management features have saved me hours every week. My students love the interactive assignment system.',
      rating: 5,
      avatar: null
    },
    {
      name: 'Jennifer Chen',
      role: 'Parent',
      content: 'Finally, a platform where I can stay connected with my child\'s education. Real-time updates and easy communication with teachers is amazing.',
      rating: 5,
      avatar: null
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Students Managed' },
    { number: '500+', label: 'Schools Using' },
    { number: '98%', label: 'User Satisfaction' },
    { number: '24/7', label: 'Support Available' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="lg:col-span-6">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  The Future of
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    {' '}Education Management
                  </span>
                </h1>
                <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                  Streamline your educational institution with our comprehensive platform. 
                  Manage students, teachers, classes, and everything in between with AI-powered insights.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                  <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-200 flex items-center justify-center">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </button>
                </div>
                <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6">
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"></div>
                      ))}
                    </div>
                    <span className="ml-3 text-sm text-gray-600">Trusted by 500+ schools</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-6 mt-12 lg:mt-0">
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <GraduationCap className="h-6 w-6 text-blue-600" />
                        <span className="font-semibold text-gray-900">EduManage Dashboard</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <Users className="h-5 w-5 text-blue-600 mb-1" />
                          <div className="text-sm font-medium">1,234 Students</div>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                          <BookOpen className="h-5 w-5 text-green-600 mb-1" />
                          <div className="text-sm font-medium">48 Classes</div>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                          <Award className="h-5 w-5 text-purple-600 mb-1" />
                          <div className="text-sm font-medium">95% Attendance</div>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-lg">
                          <BarChart3 className="h-5 w-5 text-yellow-600 mb-1" />
                          <div className="text-sm font-medium">A+ Average</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Education
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From student enrollment to AI-powered insights, EduManage provides all the tools 
              you need to run a modern educational institution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Loved by Educators Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what schools and teachers are saying about EduManage
            </p>
          </div>

          <div className="relative">
            <div className="bg-gray-50 rounded-2xl p-8 lg:p-12 text-center">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl lg:text-2xl text-gray-900 font-medium mb-6 leading-relaxed">
                "{testimonials[activeTestimonial].content}"
              </blockquote>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{testimonials[activeTestimonial].name}</div>
                  <div className="text-gray-600">{testimonials[activeTestimonial].role}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your institution's needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <p className="text-gray-600 mb-6">Perfect for small schools</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Up to 100 students</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Basic reporting</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Email support</span>
                  </li>
                </ul>
                <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  Get Started
                </button>
              </div>
            </div>

            {/* Professional Plan */}
            <div className="bg-blue-600 rounded-2xl p-8 shadow-xl relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                <p className="text-blue-100 mb-6">For growing institutions</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">$79</span>
                  <span className="text-blue-100">/month</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-200 mr-3" />
                    <span className="text-white">Up to 500 students</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-200 mr-3" />
                    <span className="text-white">Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-200 mr-3" />
                    <span className="text-white">AI teaching assistant</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-200 mr-3" />
                    <span className="text-white">Priority support</span>
                  </li>
                </ul>
                <button className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Get Started
                </button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-6">For large institutions</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">Custom</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Unlimited students</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Dedicated support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>On-premise deployment</span>
                  </li>
                </ul>
                <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Transform Your School?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of educators who are already using EduManage to streamline their operations and improve student outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
            >
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <GraduationCap className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">EduManage</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The comprehensive education management platform designed to streamline operations and enhance learning outcomes for schools worldwide.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 EduManage. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
