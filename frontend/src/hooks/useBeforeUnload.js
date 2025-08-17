import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export const useBeforeUnload = (shouldWarn = true) => {
  const { user } = useAuth()

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (shouldWarn && user) {
        const message = 'Are you sure you want to leave? You will be logged out and any unsaved changes will be lost.'
        event.preventDefault()
        event.returnValue = message
        return message
      }
    }

    if (shouldWarn && user) {
      window.addEventListener('beforeunload', handleBeforeUnload)
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [shouldWarn, user])
}

export default useBeforeUnload
