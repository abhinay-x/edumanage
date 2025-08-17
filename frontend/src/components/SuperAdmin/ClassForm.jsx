import React from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'

const ClassForm = ({ classData, subjects, onSubmit, onClose }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: classData || {
      name: '',
      grade: '',
      section: '',
      description: '',
      capacity: '',
      room: '',
      classTeacher: '',
      subjects: []
    }
  })

  const grade = watch('grade')
  const section = watch('section')

  const handleFormSubmit = (data) => {
    // Auto-generate name if not provided
    if (!data.name && data.grade && data.section) {
      data.name = `Grade ${data.grade} - ${data.section}`
    }

    onSubmit({
      ...data,
      grade: parseInt(data.grade),
      capacity: data.capacity ? parseInt(data.capacity) : null,
      subjects: data.subjects || []
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {classData ? 'Edit Class' : 'Add New Class'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade *
              </label>
              <select
                {...register('grade', { required: 'Grade is required' })}
                className="input w-full"
              >
                <option value="">Select Grade</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              {errors.grade && (
                <p className="mt-1 text-sm text-red-600">{errors.grade.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section *
              </label>
              <select
                {...register('section', { required: 'Section is required' })}
                className="input w-full"
              >
                <option value="">Select Section</option>
                {['A', 'B', 'C', 'D', 'E', 'F'].map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
              {errors.section && (
                <p className="mt-1 text-sm text-red-600">{errors.section.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity
              </label>
              <input
                {...register('capacity', {
                  pattern: {
                    value: /^\d+$/,
                    message: 'Capacity must be a number'
                  }
                })}
                type="number"
                min="1"
                max="100"
                className="input w-full"
                placeholder="e.g., 30"
              />
              {errors.capacity && (
                <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class Name
            </label>
            <input
              {...register('name')}
              type="text"
              className="input w-full"
              placeholder={grade && section ? `Grade ${grade} - ${section}` : "Auto-generated from grade and section"}
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave empty to auto-generate from grade and section
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="input w-full"
              placeholder="Brief description of the class"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Number
              </label>
              <input
                {...register('room')}
                type="text"
                className="input w-full"
                placeholder="e.g., Room 101"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class Teacher
              </label>
              <input
                {...register('classTeacher')}
                type="text"
                className="input w-full"
                placeholder="Teacher name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subjects
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {subjects.map((subject) => (
                <label key={subject.id} className="flex items-center">
                  <input
                    {...register('subjects')}
                    type="checkbox"
                    value={subject.id}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">
                    {subject.name} ({subject.code})
                  </span>
                </label>
              ))}
            </div>
            {subjects.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                No subjects available. Create subjects first to assign them to classes.
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {classData ? 'Update Class' : 'Create Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClassForm
