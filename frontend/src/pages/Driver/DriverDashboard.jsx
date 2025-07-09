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
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Driver Dashboard</h1>
        <div className="header-actions">
          <div className="availability-toggle">
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={isOnline} 
                onChange={toggleAvailability}
              />
              <span className="slider"></span>
            </label>
            <span className={`status-text ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="driver-info-card">
          <h2>Welcome, {driver?.name}!</h2>
          <p>You are currently {isOnline ? 'online and available for rides' : 'offline'}.</p>
        </div>

        {currentRide ? (
          <div className="current-ride-section">
            <h2>Current Ride</h2>
            <div className="ride-card">
              <div className="ride-details">
                <p><strong>Ride ID:</strong> {currentRide.rideId}</p>
                <p><strong>Status:</strong> {currentRide.status}</p>
                <p><strong>From:</strong> {currentRide.pickupLocation}</p>
                <p><strong>To:</strong> {currentRide.dropoffLocation}</p>
                <p><strong>Fare:</strong> ₹{currentRide.fare}</p>
                {currentRide.user && (
                  <div className="user-info">
                    <p><strong>User:</strong> {currentRide.user.name}</p>
                    <p><strong>Phone:</strong> {currentRide.user.phone}</p>
                  </div>
                )}
              </div>
              <div className="ride-actions">
                <button 
                  onClick={() => navigate('/driver/current-ride')} 
                  className="manage-ride-btn"
                >
                  Manage Ride
                </button>
              </div>
            </div>
          </div>
        ) : isOnline ? (
          <div className="available-rides-section">
            <h2>Available Ride Requests</h2>
            {availableRides.length === 0 ? (
              <div className="no-rides">
                <p>No ride requests available at the moment.</p>
                <p>Stay online to receive new requests!</p>
              </div>
            ) : (
              <div className="rides-list">
                {availableRides.map((ride) => (
                  <div key={ride.rideId} className="ride-request-card">
                    <div className="ride-info">
                      <p><strong>From:</strong> {ride.pickupLocation}</p>
                      <p><strong>To:</strong> {ride.dropoffLocation}</p>
                      <p><strong>Distance:</strong> {ride.distance} km</p>
                      <p><strong>Fare:</strong> ₹{ride.fare}</p>
                    </div>
                    <button 
                      onClick={() => acceptRide(ride.rideId)}
                      className="accept-ride-btn"
                    >
                      Accept Ride
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="offline-message">
            <h2>You're Offline</h2>
            <p>Turn on availability to start receiving ride requests.</p>
          </div>
        )}

        <div className="dashboard-actions">
          <div className="action-grid">
            <button 
              onClick={() => navigate('/driver/profile')} 
              className="action-btn"
            >
              👤 My Profile
            </button>
            <button 
              onClick={() => navigate('/driver/history')} 
              className="action-btn"
            >
              📋 Ride History
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding: 20px 0;
          border-bottom: 2px solid #f0f0f0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .availability-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #28a745;
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        .status-text {
          font-weight: 600;
          font-size: 16px;
        }

        .status-text.online {
          color: #28a745;
        }

        .status-text.offline {
          color: #6c757d;
        }

        .logout-btn {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 500;
        }

        .driver-info-card {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 25px;
          margin-bottom: 30px;
        }

        .driver-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .stat-item {
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .stat-value {
          display: block;
          font-size: 24px;
          font-weight: bold;
          color: #3498db;
          margin-bottom: 5px;
        }

        .stat-label {
          color: #666;
          font-size: 14px;
        }

        .current-ride-section, .available-rides-section, .offline-message {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 25px;
          margin-bottom: 30px;
        }

        .ride-card, .ride-request-card {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 15px;
          border-left: 4px solid #3498db;
        }

        .ride-details p {
          margin: 8px 0;
        }

        .user-info {
          background: white;
          padding: 15px;
          border-radius: 8px;
          margin-top: 15px;
        }

        .manage-ride-btn, .accept-ride-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          margin-top: 15px;
        }

        .no-rides {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .rides-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .ride-request-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .offline-message {
          text-align: center;
          color: #666;
        }

        .dashboard-actions {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 25px;
        }

        .action-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .action-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 20px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        }

        .loading, .error {
          text-align: center;
          padding: 40px;
          font-size: 18px;
        }

        .error {
          color: #e74c3c;
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 10px;
          }
          
          .dashboard-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }
          
          .header-actions {
            flex-direction: column;
          }
          
          .ride-request-card {
            flex-direction: column;
            gap: 15px;
          }
        }
      `}</style>
    </div>
  );
}
