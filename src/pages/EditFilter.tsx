import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EditFilter() {
  const navigate = useNavigate()

  // This page is now a simple redirect/helper to take users to the main Filters page,
  // which is fully powered by the backend APIs.
  useEffect(() => {
    navigate('/categories/filters', { replace: true })
  }, [navigate])

  return null
}

