import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { rideService } from '../../services/rideService';
import { authService } from '../../services/authService';

export default function Availability() {
  const [isOnline, setIsOnline] = useState(false);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [availableRides, setAvailableRides] = useState([]);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDriverData = async () => {
      try {
        const driverProfile = await authService.getDriverProfile();
        setDriver(driverProfile);
        setIsOnline(driverProfile.isAvailable || false);
        
        if (driverProfile.isAvailable) {
          await loadAvailableRides();
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load driver data');
      } finally {
        setLoading(false);
      }
    };

    loadDriverData();
  }, []);

  useEffect(() => {
    // Poll for available rides every 30 seconds when online
    const interval = setInterval(() => {
      if (isOnline) {
        loadAvailableRides();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [isOnline]);

  const retryLoadData = async () => {
    setLoading(true);
    setError('');
    try {
      const driverProfile = await authService.getDriverProfile();
      setDriver(driverProfile);
      setIsOnline(driverProfile.isAvailable || false);
      
      if (driverProfile.isAvailable) {
        await loadAvailableRides();
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
      setAvailableRides(rides || []);
    } catch (err) {
      console.error(err);
      // Don't show error for this as it might be normal to have no rides
    }
  };

  const toggleAvailability = async () => {
    setUpdating(true);
    try {
      const newStatus = !isOnline;
      await rideService.updateDriverAvailability(newStatus);
      setIsOnline(newStatus);
      
      if (newStatus) {
        await loadAvailableRides();
      } else {
        setAvailableRides([]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update availability status');
    } finally {
      setUpdating(false);
    }
  };

  const acceptRide = async (rideId) => {
    try {
      await rideService.acceptRide(rideId);
      // Redirect to current ride page
      navigate('/driver/current-ride');
    } catch (err) {
      console.error(err);
      alert('Failed to accept ride. It may have been taken by another driver.');
      await loadAvailableRides(); // Refresh the list
    }
  };

  if (loading) {
    return (
      <div className="availability-container">
        <div className="loading">Loading availability status...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="availability-container">
        <div className="error">{error}</div>
        <button onClick={retryLoadData} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="availability-container">
      <header className="availability-header">
        <h1>Driver Availability</h1>
        <button onClick={() => navigate('/driver/dashboard')} className="back-btn">
          ← Dashboard
        </button>
      </header>

      <div className="availability-content">
        <div className="status-card">
          <div className="status-section">
            <h2>Current Status</h2>
            <div className="status-toggle">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={isOnline} 
                  onChange={toggleAvailability}
                  disabled={updating}
                />
                <span className="slider"></span>
              </label>
              <div className="status-info">
                <span className={`status-text ${isOnline ? 'online' : 'offline'}`}>
                  {isOnline ? '🟢 Online' : '🔴 Offline'}
                </span>
                <p className="status-description">
                  {isOnline 
                    ? 'You are available to receive ride requests' 
                    : 'You are not receiving ride requests'
                  }
                </p>
              </div>
            </div>
            {updating && <p className="updating-text">Updating status...</p>}
          </div>

          <div className="driver-info">
            <h3>Driver Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Name:</span>
                <span className="value">{driver?.name}</span>
              </div>
              <div className="info-item">
                <span className="label">License:</span>
                <span className="value">{driver?.licenseNumber}</span>
              </div>
              <div className="info-item">
                <span className="label">Vehicle:</span>
                <span className="value">{driver?.vehicleDetails}</span>
              </div>
              <div className="info-item">
                <span className="label">Rating:</span>
                <span className="value">{driver?.rating || 'N/A'} ⭐</span>
              </div>
            </div>
          </div>
        </div>

        {isOnline && (
          <div className="rides-section">
            <h2>Available Ride Requests</h2>
            {availableRides.length === 0 ? (
              <div className="no-rides">
                <div className="no-rides-icon">🚗</div>
                <h3>No ride requests available</h3>
                <p>Stay online to receive new ride requests as they come in.</p>
                <button onClick={loadAvailableRides} className="refresh-btn">
                  🔄 Refresh
                </button>
              </div>
            ) : (
              <div className="rides-list">
                {availableRides.map((ride) => (
                  <div key={ride.rideId} className="ride-request-card">
                    <div className="ride-header">
                      <span className="ride-id">Ride #{ride.rideId}</span>
                      <span className="ride-time">
                        {new Date(ride.requestedAt || ride.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="ride-route">
                      <div className="route-point">
                        <span className="route-icon pickup">📍</span>
                        <div className="route-details">
                          <div className="route-label">Pickup</div>
                          <div className="route-location">{ride.pickupLocation}</div>
                        </div>
                      </div>
                      
                      <div className="route-line"></div>
                      
                      <div className="route-point">
                        <span className="route-icon dropoff">🏁</span>
                        <div className="route-details">
                          <div className="route-label">Dropoff</div>
                          <div className="route-location">{ride.dropoffLocation}</div>
                        </div>
                      </div>
                    </div>

                    <div className="ride-details">
                      <div className="detail-item">
                        <span className="detail-label">Distance:</span>
                        <span className="detail-value">{ride.distance} km</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Fare:</span>
                        <span className="detail-value">₹{ride.fare}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">User:</span>
                        <span className="detail-value">{ride.user?.name || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="ride-actions">
                      <button 
                        onClick={() => acceptRide(ride.rideId)}
                        className="accept-btn"
                      >
                        Accept Ride
                      </button>
                      <button className="details-btn">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .availability-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .availability-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .back-btn, .retry-btn {
          background: #6c757d;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
        }

        .status-card, .rides-section {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 25px;
          margin-bottom: 20px;
        }

        .status-section {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f0f0f0;
        }

        .status-toggle {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 15px;
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

        .status-info {
          flex: 1;
        }

        .status-text {
          font-size: 18px;
          font-weight: 600;
          display: block;
          margin-bottom: 5px;
        }

        .status-text.online {
          color: #28a745;
        }

        .status-text.offline {
          color: #6c757d;
        }

        .status-description {
          color: #666;
          margin: 0;
        }

        .updating-text {
          color: #ffc107;
          font-style: italic;
          margin-top: 10px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .label {
          font-weight: 600;
          color: #666;
        }

        .value {
          color: #333;
        }

        .no-rides {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .no-rides-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .refresh-btn {
          background: #17a2b8;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 15px;
        }

        .rides-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .ride-request-card {
          border: 2px solid #e9ecef;
          border-radius: 10px;
          padding: 20px;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        .ride-request-card:hover {
          border-color: #3498db;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .ride-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .ride-id {
          font-weight: 600;
          color: #333;
        }

        .ride-time {
          color: #666;
          font-size: 14px;
        }

        .ride-route {
          margin-bottom: 15px;
        }

        .route-point {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .route-icon {
          width: 20px;
          text-align: center;
        }

        .route-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
        }

        .route-location {
          color: #333;
          font-size: 14px;
        }

        .route-line {
          width: 2px;
          height: 15px;
          background: #ddd;
          margin-left: 9px;
          margin-bottom: 8px;
        }

        .ride-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 10px;
          margin-bottom: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .detail-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
        }

        .detail-value {
          color: #333;
          font-weight: 500;
        }

        .ride-actions {
          display: flex;
          gap: 10px;
        }

        .accept-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          flex: 1;
          transition: background 0.3s;
        }

        .accept-btn:hover {
          background: #218838;
        }

        .details-btn {
          background: #6c757d;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
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
          .availability-container {
            padding: 10px;
          }
          
          .availability-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }
          
          .status-toggle {
            flex-direction: column;
            text-align: center;
          }
          
          .info-grid {
            grid-template-columns: 1fr;
          }
          
          .ride-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
