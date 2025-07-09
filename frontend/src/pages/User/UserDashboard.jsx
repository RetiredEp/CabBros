import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { rideService } from '../../services/rideService';
import './UserDashboard.css';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [currentRide, setCurrentRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadUserData = useCallback(async () => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }

      console.log('Loading user data with token:', token.substring(0, 20) + '...');

      const [userProfile, currentRideData] = await Promise.all([
        authService.getUserProfile(),
        rideService.getCurrentRide().catch((err) => {
          console.log('No current ride found:', err.response?.status);
          if (err.response?.status === 404) {
            return null; // User has no current ride
          }
          throw err; // Re-throw other errors
        })
      ]);
      
      setUser(userProfile);
      setCurrentRide(currentRideData);
    } catch (err) {
      console.error('Error loading user data:', err);
      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        console.log('Unauthorized, clearing tokens and redirecting');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/login');
        return;
      }
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="content-wrapper">
          <div className="loading-spinner"></div>
          <p style={{textAlign: 'center'}}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="content-wrapper">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <header className="app-header">
          <h1 className="app-title">Welcome, {user?.name}!</h1>
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </header>

        <div className="dashboard-content">
          {currentRide ? (
            <div className="app-card">
              <h2>
                {currentRide.status === 'COMPLETED' ? 'Ride Completed - Payment Required' : 
                 currentRide.status === 'REQUESTED' ? 'Ride Requested - Waiting for Driver' :
                 currentRide.status === 'ACCEPTED' ? 'Driver Assigned - En Route' :
                 currentRide.status === 'IN_PROGRESS' ? 'Ride in Progress' : 'Current Ride'}
              </h2>
              <div className="ride-card">
                <p><strong>Status:</strong> <span className={`status ${currentRide.status.toLowerCase()}`}>{currentRide.status}</span></p>
                <p><strong>From:</strong> {currentRide.pickupLocation}</p>
                <p><strong>To:</strong> {currentRide.dropoffLocation}</p>
                <p><strong>Fare:</strong> ₹{currentRide.fare}</p>
                {currentRide.driver && (
                  <div className="driver-info">
                    <p><strong>Driver:</strong> {currentRide.driver.name}</p>
                    <p><strong>Phone:</strong> {currentRide.driver.phone}</p>
                    <p><strong>Vehicle:</strong> {currentRide.driver.vehicleDetails}</p>
                  </div>
                )}
                {currentRide.status === 'COMPLETED' ? (
                  <button 
                    onClick={() => navigate('/user/current-ride')} 
                    className="btn"
                    style={{backgroundColor: '#ff6b6b', color: 'white'}}
                  >
                    💳 Pay Now - ₹{currentRide.fare}
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/user/current-ride')} 
                    className="btn"
                  >
                    {currentRide.status === 'REQUESTED' ? '👁️ Track Status' : '🚗 View Current Ride'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="app-card" style={{textAlign: 'center'}}>
              <h2>No Active Ride</h2>
              <p>Ready to book your next ride?</p>
              <button 
                onClick={() => navigate('/user/book')} 
                className="btn"
              >
                Book a Ride
              </button>
            </div>
          )}

          <div className="app-card">
            <div className="action-grid">
              <button 
                onClick={() => navigate('/user/book')} 
                className="btn"
              >
                📍 Book New Ride
              </button>
              <button 
                onClick={() => navigate('/user/history')} 
                className="btn"
              >
                📋 Ride History
              </button>
              <button 
                onClick={() => navigate('/user/profile')} 
                className="btn"
              >
                👤 My Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
