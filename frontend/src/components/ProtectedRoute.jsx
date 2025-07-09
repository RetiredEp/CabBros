// src/components/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function ProtectedRoute({ children, allowedRoles }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  const role = authService.getRole();
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to appropriate dashboard based on role
    if (role === 'USER') {
      return <Navigate to="/user/dashboard" replace />;
    } else if (role === 'DRIVER') {
      return <Navigate to="/driver/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  return children;
}
