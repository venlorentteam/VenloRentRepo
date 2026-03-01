import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from "../context/AuthProvider";
import { Loader } from '../exports'

const ProtectedRoute = ({ children }) => {
      const { user, isLoading } = useAuth();
        if (isLoading) return <Loader />;
        if (!user) return <Navigate to="/login" />;
        return children;
}
export default ProtectedRoute