import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from "../context/AuthProvider";
import { Loader } from '../exports'

const ProtectedRoute = ({ children }) => {
      const { user, isLoading } = useAuth();
      const location = useLocation()

        if (isLoading) return <Loader />;
        if (!user) {
          return <Navigate to="/login" replace state={{ from: location }} />;
        }
        return children;
}
export default ProtectedRoute
