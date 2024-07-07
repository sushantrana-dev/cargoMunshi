import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import the useAuth hook

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth() || {};
  const location = useLocation();

  if (!user) {
    // Redirect them to the /login page, but save the current location they were trying to go to
    return(<><Navigate to="/" state={{ from: location }} replace /></>);
  }

  return children;
};

export default ProtectedRoute;