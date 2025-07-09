// src/routes/AppRouter.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Register from '../pages/Register/Register';
import Login from '../pages/Login/Login';
import ProtectedRoute from '../components/ProtectedRoute';

// User Components
import UserDashboard from '../pages/User/UserDashboard';
import Booking from '../pages/User/Booking';
import CurrentRide from '../pages/User/CurrentRide';
import UserProfile from '../pages/User/Profile';
import RideHistory from '../pages/User/RideHistory';

// Driver Components
import DriverDashboard from '../pages/Driver/DriverDashboard';
import DriverCurrentRide from '../pages/Driver/CurrentRide';
import DriverProfile from '../pages/Driver/Profile';
import DriverRideHistory from '../pages/Driver/RideHistory';
import Availability from '../pages/Driver/Availability';
import AvailableRides from '../pages/Driver/AvailableRides';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* User Protected Routes */}
        <Route path="/user/dashboard" element={<ProtectedRoute allowedRoles={['USER']}><UserDashboard /></ProtectedRoute>} />
        <Route path="/user/book" element={<ProtectedRoute allowedRoles={['USER']}><Booking /></ProtectedRoute>} />
        <Route path="/user/current-ride" element={<ProtectedRoute allowedRoles={['USER']}><CurrentRide /></ProtectedRoute>} />
        <Route path="/user/profile" element={<ProtectedRoute allowedRoles={['USER']}><UserProfile /></ProtectedRoute>} />
        <Route path="/user/history" element={<ProtectedRoute allowedRoles={['USER']}><RideHistory /></ProtectedRoute>} />
        
        {/* Driver Protected Routes */}
        <Route path="/driver/dashboard" element={<ProtectedRoute allowedRoles={['DRIVER']}><DriverDashboard /></ProtectedRoute>} />
        <Route path="/driver/current-ride" element={<ProtectedRoute allowedRoles={['DRIVER']}><DriverCurrentRide /></ProtectedRoute>} />
        <Route path="/driver/profile" element={<ProtectedRoute allowedRoles={['DRIVER']}><DriverProfile /></ProtectedRoute>} />
        <Route path="/driver/history" element={<ProtectedRoute allowedRoles={['DRIVER']}><DriverRideHistory /></ProtectedRoute>} />
        <Route path="/driver/availability" element={<ProtectedRoute allowedRoles={['DRIVER']}><Availability /></ProtectedRoute>} />
        <Route path="/driver/available-rides" element={<ProtectedRoute allowedRoles={['DRIVER']}><AvailableRides /></ProtectedRoute>} />
        
        {/* Redirect old routes */}
        <Route path="/user/booking" element={<ProtectedRoute allowedRoles={['USER']}><Booking /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}
