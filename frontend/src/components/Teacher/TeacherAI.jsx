import React, { useState, useEffect } from 'react'
import { Brain, BookOpen, TrendingUp, Users, FileText, Lightbulb, BarChart3, Target, Clock, Send } from 'lucide-react'
import toast from 'react-hot-toast'

const TeacherAI = () => {
  const [activeTab, setActiveTab] = useState('lesson-plans')
  const [loading, setLoading] = useState(false)
  const [lessonPlanForm, setLessonPlanForm] = useState({
    subject: '',
    grade: '',
    topic: '',
    duration: '45',
    objectives: '',
    difficulty: 'intermediate'
  })
  const [generatedContent, setGeneratedContent] = useState(null)
  const [insights, setInsights] = useState([])
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    // Mock AI insights and recommendations
    const mockInsights = [
      {
        id: 1,
        type: 'performance',
        title: 'Class Performance Trend',
        description: 'Grade 10A Mathematics shows 15% improvement in test scores over the last month',
        metric: '+15%',
        color: 'green',
        icon: TrendingUp
      },
      {
        id: 2,
        type: 'engagement',
        title: 'Student Engagement',
        description: 'Algebra topics show higher engagement than Geometry (85% vs 72%)',
        metric: '85%',
        color: 'blue',
        icon: Users
      },
      {
        id: 3,
        type: 'risk',
        title: 'At-Risk Students',
        description: '3 students showing declining performance patterns need attention',
        metric: '3 students',
        color: 'red',
        icon: Target
      }
    ]

    const mockRecommendations = [
      {
        id: 1,
        category: 'Teaching Strategy',
        title: 'Visual Learning Enhancement',
        description: 'Based on class performance data, incorporating more visual aids could improve understanding by 20%',
        priority: 'high',
        estimatedImpact: 'High'
      },
      {
        id: 2,
        category: 'Student Support',
        title: 'Individual Tutoring',
        description: 'Michael Davis and Emily Wilson would benefit from additional support in algebraic concepts',
        priority: 'medium',
        estimatedImpact: 'Medium'
      },
      {
        id: 3,
        category: 'Curriculum',
        title: 'Pace Adjustment',
        description: 'Consider slowing down the current pace for complex topics to improve retention',
        priority: 'low',
        estimatedImpact: 'Medium'
      }
    ]

    setInsights(mockInsights)
    setRecommendations(mockRecommendations)
  }, [])

  const handleGenerateLessonPlan = async () => {
    if (!lessonPlanForm.subject || !lessonPlanForm.topic) {
      toast.error('Please fill in subject and topic fields')
      return
    }

    setLoading(true)
    
    // Simulate AI generation delay
    setTimeout(() => {
      const mockLessonPlan = {
        title: `${lessonPlanForm.topic} - ${lessonPlanForm.subject}`,
        duration: `${lessonPlanForm.duration} minutes`,
        grade: lessonPlanForm.grade,
        objectives: [
          `Understand the fundamental concepts of ${lessonPlanForm.topic}`,
          'Apply learned concepts to solve practical problems',
          'Demonstrate mastery through guided practice'
        ],
        materials: [
          'Whiteboard and markers',
          'Student worksheets',
          'Calculator (if needed)',
          'Visual aids/diagrams'
        ],
        activities: [
          {
            phase: 'Introduction (10 min)',
            description: 'Review previous concepts and introduce new topic with real-world examples'
          },
          {
            phase: 'Direct Instruction (15 min)',
            description: 'Explain key concepts with step-by-step demonstrations'
          },
          {
            phase: 'Guided Practice (15 min)',
            description: 'Work through examples together with student participation'
          },
          {
            phase: 'Independent Practice (5 min)',
            description: 'Students complete practice problems individually'
          }
        ],
        assessment: [
          'Formative: Observe student responses during guided practice',
          'Summative: Exit ticket with 2-3 key concept questions',
          'Homework: Practice worksheet for reinforcement'
        ],
        differentiation: [
          'Advanced learners: Additional challenge problems',
          'Struggling learners: Simplified examples and extra support',
          'Visual learners: Diagrams and graphic organizers'
        ]
      }

      setGeneratedContent(mockLessonPlan)
      setLoading(false)
      toast.success('Lesson plan generated successfully!')
    }, 2000)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getInsightColor = (color) => {
    switch (color) {
      case 'green': return 'text-green-600 bg-green-100'
      case 'blue': return 'text-blue-600 bg-blue-100'
      case 'red': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Teaching Assistant</h1>
          <p className="text-gray-600">AI-powered insights and lesson planning tools</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Brain className="w-4 h-4" />
          <span>Powered by AI</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('lesson-plans')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'lesson-plans'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Lesson Plans
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'insights'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Performance Insights
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'recommendations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Lightbulb className="w-4 h-4 inline mr-2" />
            Recommendations
          </button>
        </nav>
      </div>

      {/* Lesson Plan Generator */}
      {activeTab === 'lesson-plans' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Lesson Plan</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={lessonPlanForm.subject}
                    onChange={(e) => setLessonPlanForm({ ...lessonPlanForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Mathematics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                  <select
                    value={lessonPlanForm.grade}
                    onChange={(e) => setLessonPlanForm({ ...lessonPlanForm, grade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Grade</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                <input
                  type="text"
                  value={lessonPlanForm.topic}
                  onChange={(e) => setLessonPlanForm({ ...lessonPlanForm, topic: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Quadratic Equations"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <select
                    value={lessonPlanForm.duration}
                    onChange={(e) => setLessonPlanForm({ ...lessonPlanForm, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                  <select
                    value={lessonPlanForm.difficulty}
                    onChange={(e) => setLessonPlanForm({ ...lessonPlanForm, difficulty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Learning Objectives (Optional)</label>
                <textarea
                  value={lessonPlanForm.objectives}
                  onChange={(e) => setLessonPlanForm({ ...lessonPlanForm, objectives: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Describe what students should learn..."
                />
              </div>

              <button
                onClick={handleGenerateLessonPlan}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Generate Lesson Plan
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Lesson Plan */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Lesson Plan</h3>
            
            {generatedContent ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="border-b pb-3">
                  <h4 className="font-medium text-lg">{generatedContent.title}</h4>
                  <div className="text-sm text-gray-500 mt-1">
                    <span>{generatedContent.grade}</span> • <span>{generatedContent.duration}</span>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Learning Objectives</h5>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {generatedContent.objectives.map((obj, index) => (
                      <li key={index}>{obj}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Materials Needed</h5>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {generatedContent.materials.map((material, index) => (
                      <li key={index}>{material}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Lesson Activities</h5>
                  <div className="space-y-2">
                    {generatedContent.activities.map((activity, index) => (
                      <div key={index} className="border-l-4 border-blue-200 pl-3">
                        <div className="font-medium text-sm text-blue-800">{activity.phase}</div>
                        <div className="text-sm text-gray-600">{activity.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Assessment</h5>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {generatedContent.assessment.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Differentiation</h5>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {generatedContent.differentiation.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Fill out the form and click "Generate Lesson Plan" to create an AI-powered lesson plan</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Performance Insights */}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((insight) => {
            const IconComponent = insight.icon
            return (
              <div key={insight.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${getInsightColor(insight.color)}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className={`text-lg font-bold ${insight.color === 'green' ? 'text-green-600' : insight.color === 'blue' ? 'text-blue-600' : 'text-red-600'}`}>
                    {insight.metric}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{insight.title}</h4>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </div>
            )
          })}
        </div>
      )}

      {/* AI Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900">{rec.title}</h4>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${getPriorityColor(rec.priority)}`}>
                      {rec.priority} priority
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{rec.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Category: {rec.category}</span>
                    <span>Expected Impact: {rec.estimatedImpact}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TeacherAI
