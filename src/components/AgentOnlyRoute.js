import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import { Loader } from '../exports'

// Keeps agent-only screens out of regular user sessions.
const AgentOnlyRoute = ({ children }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  if (user.kycStatus !== 'verified') return <Navigate to="/account" replace />

  return children
}

export default AgentOnlyRoute
