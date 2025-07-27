import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { auth, loading } = useContext(AuthContext);

  // While auth is still loading (e.g. checking localStorage)
  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
}

  // If not logged in, redirect to login
  if (!auth) {
    return <Navigate to="/login" replace />;
  }
  console.log("auth:", auth, "loading:", loading);
  // If logged in, render the protected content
  return children;
}