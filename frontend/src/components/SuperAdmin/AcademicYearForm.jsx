import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { X, Plus, Trash2 } from 'lucide-react'

const AcademicYearForm = ({ year, onSubmit, onClose }) => {
  const { register, handleSubmit, control, formState: { errors }, watch } = useForm({
    defaultValues: year || {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      isActive: false,
      terms: [
        { name: 'Term 1', startDate: '', endDate: '' }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'terms'
  })

  const startDate = watch('startDate')
  const endDate = watch('endDate')

  const handleFormSubmit = (data) => {
    // Validate that terms are within academic year dates
    if (data.terms && data.terms.length > 0) {
      const yearStart = new Date(data.startDate)
      const yearEnd = new Date(data.endDate)
      
      for (let term of data.terms) {
        if (term.startDate && term.endDate) {
          const termStart = new Date(term.startDate)
          const termEnd = new Date(term.endDate)
          
          if (termStart < yearStart || termEnd > yearEnd) {
            toast.error('All terms must be within the academic year dates')
            return
          }
          
          if (termStart >= termEnd) {
            toast.error('Term start date must be before end date')
            return
          }
        }
      }
    }
    
    onSubmit(data)
  }

  const addTerm = () => {
    append({ name: `Term ${fields.length + 1}`, startDate: '', endDate: '' })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {year ? 'Edit Academic Year' : 'Add New Academic Year'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">Basic Information</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year Name *
              </label>
              <input
                {...register('name', { required: 'Academic year name is required' })}
                type="text"
                className="input w-full"
                placeholder="e.g., 2024-2025"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="input w-full"
                placeholder="Brief description of the academic year"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  {...register('startDate', { required: 'Start date is required' })}
                  type="date"
                  className="input w-full"
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  {...register('endDate', { 
                    required: 'End date is required',
                    validate: value => {
                      if (startDate && value && new Date(value) <= new Date(startDate)) {
                        return 'End date must be after start date'
                      }
                      return true
                    }
                  })}
                  type="date"
                  className="input w-full"
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                {...register('isActive')}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Set as active academic year
              </label>
            </div>
          </div>

          {/* Terms */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium text-gray-900">Terms/Semesters</h4>
              <button
                type="button"
                onClick={addTerm}
                className="btn btn-outline btn-sm flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Term
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-medium text-gray-900">Term {index + 1}</h5>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Term Name
                      </label>
                      <input
                        {...register(`terms.${index}.name`, { required: 'Term name is required' })}
                        type="text"
                        className="input w-full"
                        placeholder="e.g., Term 1"
                      />
                      {errors.terms?.[index]?.name && (
                        <p className="mt-1 text-xs text-red-600">{errors.terms[index].name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        {...register(`terms.${index}.startDate`, { required: 'Start date is required' })}
                        type="date"
                        className="input w-full"
                        min={startDate}
                        max={endDate}
                      />
                      {errors.terms?.[index]?.startDate && (
                        <p className="mt-1 text-xs text-red-600">{errors.terms[index].startDate.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        {...register(`terms.${index}.endDate`, { required: 'End date is required' })}
                        type="date"
                        className="input w-full"
                        min={startDate}
                        max={endDate}
                      />
                      {errors.terms?.[index]?.endDate && (
                        <p className="mt-1 text-xs text-red-600">{errors.terms[index].endDate.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
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
              {year ? 'Update Academic Year' : 'Create Academic Year'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AcademicYearForm
