import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { rideService } from '../../services/rideService';

export default function AvailableRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadAvailableRides();
    // Auto-refresh every 15 seconds
    const interval = setInterval(loadAvailableRides, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadAvailableRides = async () => {
    try {
      const availableRides = await rideService.getAvailableRideRequests();
      setRides(availableRides || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load available rides');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadAvailableRides();
  };

  const acceptRide = async (rideId) => {
    try {
      await rideService.acceptRide(rideId);
      navigate('/driver/current-ride');
    } catch (err) {
      console.error(err);
      alert('Failed to accept ride. It may have been taken by another driver.');
      loadAvailableRides(); // Refresh the list
    }
  };

  const calculateTimeSince = (dateString) => {
    const now = new Date();
    const rideTime = new Date(dateString);
    const diffInMinutes = Math.floor((now - rideTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ago`;
  };

  if (loading) {
    return (
      <div className="available-rides-container">
        <div className="loading">Loading available rides...</div>
      </div>
    );
  }

  return (
    <div className="available-rides-container">
      <header className="rides-header">
        <h1>Available Ride Requests</h1>
        <div className="header-actions">
          <button 
            onClick={handleRefresh} 
            className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
            disabled={refreshing}
          >
            🔄 {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button onClick={() => navigate('/driver/dashboard')} className="back-btn">
            ← Dashboard
          </button>
        </div>
      </header>

      <div className="rides-content">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={handleRefresh} className="retry-btn">Try Again</button>
          </div>
        )}

        <div className="rides-stats">
          <div className="stat-item">
            <span className="stat-number">{rides.length}</span>
            <span className="stat-label">Available Requests</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {rides.length > 0 ? `₹${Math.round(rides.reduce((sum, ride) => sum + ride.fare, 0) / rides.length)}` : '₹0'}
            </span>
            <span className="stat-label">Average Fare</span>
          </div>
        </div>

        {rides.length === 0 ? (
          <div className="no-rides">
            <div className="no-rides-icon">🚗</div>
            <h2>No ride requests available</h2>
            <p>New ride requests will appear here automatically.</p>
            <p>Make sure you're online to receive requests!</p>
            <div className="no-rides-actions">
              <button onClick={() => navigate('/driver/availability')} className="availability-btn">
                Check Availability Status
              </button>
              <button onClick={handleRefresh} className="refresh-btn-large">
                Refresh Now
              </button>
            </div>
          </div>
        ) : (
          <div className="rides-list">
            {rides.map((ride) => (
              <div key={ride.rideId} className="ride-card">
                <div className="ride-header">
                  <div className="ride-id">Ride #{ride.rideId}</div>
                  <div className="ride-time">
                    {calculateTimeSince(ride.requestedAt || ride.createdAt)}
                  </div>
                </div>

                <div className="ride-route">
                  <div className="route-point">
                    <div className="route-icon pickup">📍</div>
                    <div className="route-details">
                      <div className="route-label">Pickup</div>
                      <div className="route-location">{ride.pickupLocation}</div>
                    </div>
                  </div>
                  
                  <div className="route-line"></div>
                  
                  <div className="route-point">
                    <div className="route-icon dropoff">🏁</div>
                    <div className="route-details">
                      <div className="route-label">Dropoff</div>
                      <div className="route-location">{ride.dropoffLocation}</div>
                    </div>
                  </div>
                </div>

                <div className="ride-info">
                  <div className="info-row">
                    <div className="info-item">
                      <span className="info-label">Distance</span>
                      <span className="info-value">{ride.distance} km</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Fare</span>
                      <span className="info-value fare">₹{ride.fare}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">User</span>
                      <span className="info-value">{ride.user?.name || 'Anonymous'}</span>
                    </div>
                  </div>
                </div>

                <div className="ride-actions">
                  <button 
                    onClick={() => acceptRide(ride.rideId)}
                    className="accept-btn"
                  >
                    Accept Ride
                  </button>
                  <button className="view-details-btn">
                    View on Map
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .available-rides-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .rides-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .refresh-btn, .back-btn {
          padding: 10px 15px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s;
        }

        .refresh-btn {
          background: #17a2b8;
          color: white;
        }

        .refresh-btn.refreshing {
          background: #6c757d;
          cursor: not-allowed;
        }

        .back-btn {
          background: #6c757d;
          color: white;
        }

        .refresh-btn:hover:not(:disabled) {
          background: #138496;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .retry-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 5px;
          cursor: pointer;
        }

        .rides-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-item {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .stat-number {
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

        .no-rides {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 60px 40px;
          text-align: center;
        }

        .no-rides-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .no-rides h2 {
          color: #333;
          margin-bottom: 15px;
        }

        .no-rides p {
          color: #666;
          margin-bottom: 10px;
        }

        .no-rides-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 30px;
          flex-wrap: wrap;
        }

        .availability-btn, .refresh-btn-large {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .availability-btn {
          background: #28a745;
          color: white;
        }

        .refresh-btn-large {
          background: #17a2b8;
          color: white;
        }

        .rides-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .ride-card {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 25px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .ride-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .ride-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .ride-id {
          font-weight: bold;
          font-size: 18px;
          color: #333;
        }

        .ride-time {
          color: #666;
          font-size: 14px;
          background: #f8f9fa;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .ride-route {
          margin-bottom: 20px;
        }

        .route-point {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 10px;
        }

        .route-icon {
          width: 24px;
          text-align: center;
          font-size: 16px;
          margin-top: 2px;
        }

        .route-details {
          flex: 1;
        }

        .route-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .route-location {
          color: #333;
          font-size: 15px;
          line-height: 1.4;
        }

        .route-line {
          width: 2px;
          height: 20px;
          background: #ddd;
          margin-left: 11px;
          margin-bottom: 10px;
        }

        .ride-info {
          margin-bottom: 20px;
        }

        .info-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .info-item {
          text-align: center;
        }

        .info-label {
          display: block;
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .info-value {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .info-value.fare {
          color: #28a745;
          font-size: 18px;
        }

        .ride-actions {
          display: flex;
          gap: 12px;
        }

        .accept-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 16px;
          flex: 1;
          transition: all 0.3s;
        }

        .accept-btn:hover {
          background: #218838;
          transform: translateY(-1px);
        }

        .view-details-btn {
          background: #6c757d;
          color: white;
          border: none;
          padding: 14px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s;
        }

        .view-details-btn:hover {
          background: #5a6268;
        }

        .loading {
          text-align: center;
          padding: 60px;
          font-size: 18px;
          color: #666;
        }

        @media (max-width: 768px) {
          .available-rides-container {
            padding: 10px;
          }
          
          .rides-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .header-actions {
            justify-content: center;
          }
          
          .rides-stats {
            grid-template-columns: 1fr 1fr;
          }
          
          .no-rides {
            padding: 40px 20px;
          }
          
          .no-rides-actions {
            flex-direction: column;
            align-items: center;
          }
          
          .ride-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
