import React from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'

const SubjectForm = ({ subject, onSubmit, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: subject || {
      name: '',
      code: '',
      description: '',
      credits: '',
      type: 'core',
      department: ''
    }
  })

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      credits: data.credits ? parseInt(data.credits) : null
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {subject ? 'Edit Subject' : 'Add New Subject'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Name *
              </label>
              <input
                {...register('name', { required: 'Subject name is required' })}
                type="text"
                className="input w-full"
                placeholder="e.g., Mathematics"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Code *
              </label>
              <input
                {...register('code', { required: 'Subject code is required' })}
                type="text"
                className="input w-full"
                placeholder="e.g., MATH101"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="input w-full"
              placeholder="Brief description of the subject"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credits
              </label>
              <input
                {...register('credits', {
                  pattern: {
                    value: /^\d+$/,
                    message: 'Credits must be a number'
                  }
                })}
                type="number"
                min="1"
                max="10"
                className="input w-full"
                placeholder="e.g., 3"
              />
              {errors.credits && (
                <p className="mt-1 text-sm text-red-600">{errors.credits.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Type
              </label>
              <select
                {...register('type')}
                className="input w-full"
              >
                <option value="core">Core</option>
                <option value="elective">Elective</option>
                <option value="optional">Optional</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <input
              {...register('department')}
              type="text"
              className="input w-full"
              placeholder="e.g., Science, Arts, Commerce"
            />
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
              {subject ? 'Update Subject' : 'Create Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SubjectForm
