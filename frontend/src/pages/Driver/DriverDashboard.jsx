import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { rideService } from '../../services/rideService';

export default function DriverDashboard() {
  const [driver, setDriver] = useState(null);
  const [currentRide, setCurrentRide] = useState(null);
  const [availableRides, setAvailableRides] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadDriverData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Poll for available rides when driver is online
  useEffect(() => {
    let interval;
    if (isOnline && !currentRide) {
      interval = setInterval(() => {
        loadAvailableRides();
      }, 10000); // Poll every 10 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOnline, currentRide]);

  const loadDriverData = async () => {
    try {
      const [driverProfile, currentRideData] = await Promise.all([
        authService.getDriverProfile(),
        rideService.getDriverCurrentRide().catch((err) => {
          console.log('No current ride found:', err.response?.status);
          if (err.response?.status === 404) {
            return null; // Driver has no current ride
          }
          throw err; // Re-throw other errors
        })
      ]);
      
      setDriver(driverProfile);
      setCurrentRide(currentRideData);
      setIsOnline(driverProfile.isAvailable || false);
      
      if (driverProfile.isAvailable) {
        loadAvailableRides();
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load driver data');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableRides = async () => {
    try {
      const rides = await rideService.getAvailableRideRequests();
      setAvailableRides(rides);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAvailability = async () => {
    try {
      const newStatus = !isOnline;
      await rideService.updateDriverAvailability(newStatus);
      setIsOnline(newStatus);
      
      if (newStatus) {
        loadAvailableRides();
      } else {
        setAvailableRides([]);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update availability');
    }
  };

  const acceptRide = async (rideId) => {
    try {
      await rideService.acceptRide(rideId);
      loadDriverData(); // Refresh data
    } catch (err) {
      console.error(err);
      alert('Failed to accept ride');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="message message-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="header">
        <h1>Driver Dashboard</h1>
        <div className="header-actions">
          <div className="flex items-center gap-md">
            <label style={{ 
              position: 'relative', 
              display: 'inline-block', 
              width: '60px', 
              height: '30px' 
            }}>
              <input 
                type="checkbox" 
                checked={isOnline} 
                onChange={toggleAvailability}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: isOnline ? 'var(--success)' : 'var(--bg-tertiary)',
                transition: 'var(--transition-normal)',
                borderRadius: '30px',
                ':before': {
                  position: 'absolute',
                  content: '',
                  height: '22px',
                  width: '22px',
                  left: isOnline ? '32px' : '4px',
                  bottom: '4px',
                  backgroundColor: 'white',
                  transition: 'var(--transition-normal)',
                  borderRadius: '50%'
                }
              }}></span>
            </label>
            <span className={`text-${isOnline ? 'success' : 'muted'}`} style={{ fontWeight: '600' }}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
      </header>

      <div className="page-content">
        <div className="card">
          <h2 className="heading-lg">Welcome, {driver?.name}!</h2>
          <p className="text-secondary">You are currently {isOnline ? 'online and available for rides' : 'offline'}.</p>
        </div>

        {currentRide ? (
          <div className="card">
            <h2 className="heading-lg">Current Ride</h2>
            <div className="ride-card">
              <p><strong>Ride ID:</strong> {currentRide.rideId}</p>
              <p><strong>Status:</strong> <span className={`status-badge status-${currentRide.status.toLowerCase()}`}>{currentRide.status}</span></p>
              <p><strong>From:</strong> {currentRide.pickupLocation}</p>
              <p><strong>To:</strong> {currentRide.dropoffLocation}</p>
              <p><strong>Fare:</strong> ₹{currentRide.fare}</p>
              {currentRide.user && (
                <div className="mt-md">
                  <p><strong>User:</strong> {currentRide.user.name}</p>
                  <p><strong>Phone:</strong> {currentRide.user.phone}</p>
                </div>
              )}
              <button 
                onClick={() => navigate('/driver/current-ride')} 
                className="btn btn-primary btn-full mt-md"
              >
                Manage Ride
              </button>
            </div>
          </div>
        ) : isOnline ? (
          <div className="card">
            <h2 className="heading-lg">Available Ride Requests</h2>
            {availableRides.length === 0 ? (
              <div className="text-center">
                <p className="text-secondary">No ride requests available at the moment.</p>
                <p className="text-muted">Stay online to receive new requests!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                {availableRides.map((ride) => (
                  <div key={ride.rideId} className="ride-card">
                    <div className="mb-md">
                      <p><strong>From:</strong> {ride.pickupLocation}</p>
                      <p><strong>To:</strong> {ride.dropoffLocation}</p>
                      <p><strong>Distance:</strong> {ride.distance} km</p>
                      <p><strong>Fare:</strong> <span className="text-accent">₹{ride.fare}</span></p>
                    </div>
                    <button 
                      onClick={() => acceptRide(ride.rideId)}
                      className="btn btn-success btn-full"
                    >
                      Accept Ride
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="card text-center">
            <h2 className="heading-lg">You're Offline</h2>
            <p className="text-secondary">Turn on availability to start receiving ride requests.</p>
          </div>
        )}

        <div className="card">
          <h3 className="heading-md">Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
            <button 
              onClick={() => navigate('/driver/profile')} 
              className="btn btn-secondary btn-lg"
            >
              👤 My Profile
            </button>
            <button 
              onClick={() => navigate('/driver/history')} 
              className="btn btn-secondary btn-lg"
            >
              📋 Ride History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
