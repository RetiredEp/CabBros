import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { rideService } from '../../services/rideService';

export default function DriverRideHistory() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadRideHistory = useCallback(async () => {
    try {
      setLoading(true);
      const history = await rideService.getDriverRideHistory();
      setRides(history);
    } catch (err) {
      console.error(err);
      setError('Failed to load ride history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRideHistory();
  }, [loadRideHistory]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return '#28a745';
      case 'CANCELLED': return '#dc3545';
      case 'IN_PROGRESS': return '#ffc107';
      case 'ACCEPTED': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const calculateEarnings = () => {
    return rides
      .filter(ride => ride.status === 'COMPLETED')
      .reduce((total, ride) => total + (ride.fare || 0), 0)
      .toFixed(2);
  };

  const getFilteredCount = (status) => {
    return rides.filter(ride => ride.status === status).length;
  };

  if (loading) return <div className="container text-center"><div className="spinner"></div><p>Loading ride history...</p></div>;
  if (error) return <div className="container text-center error-message">{error}</div>;

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1>Driver Ride History</h1>
          <button onClick={() => navigate('/driver/dashboard')} className="btn btn-secondary">
            ← Dashboard
          </button>
        </div>

        <div className="card-content">
          {/* Summary Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-details">
                <div className="stat-value">₹{calculateEarnings()}</div>
                <div className="stat-label">Total Earnings</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-details">
                <div className="stat-value">{getFilteredCount('COMPLETED')}</div>
                <div className="stat-label">Completed Rides</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❌</div>
              <div className="stat-details">
                <div className="stat-value">{getFilteredCount('CANCELLED')}</div>
                <div className="stat-label">Cancelled Rides</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🚗</div>
              <div className="stat-details">
                <div className="stat-value">{rides.length}</div>
                <div className="stat-label">Total Rides</div>
              </div>
            </div>
          </div>

          {rides.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🚗</div>
              <h2>No rides yet</h2>
              <p>Your completed rides will appear here</p>
              <button onClick={() => navigate('/driver/availability')} className="btn btn-primary">
                Go Online to Accept Rides
              </button>
            </div>
        </div>
      ) : (
        <div className="rides-list">
          {rides.map((ride) => (
            <div key={ride.rideId} className="ride-card">
              <div className="ride-header">
                <div className="ride-id">Ride #{ride.rideId}</div>
                <div 
                  className="ride-status"
                  style={{ backgroundColor: getStatusColor(ride.status) }}
                >
                  {ride.status}
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
                    <span className="info-label">Date:</span>
                    <span className="info-value">
                      {new Date(ride.createdAt || ride.requestedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Time:</span>
                    <span className="info-value">
                      {new Date(ride.createdAt || ride.requestedAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-item">
                    <span className="info-label">Distance:</span>
                    <span className="info-value">{ride.distance} km</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Passenger:</span>
                    <span className="info-value">{ride.user?.name || 'Passenger'}</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-item fare">
                    <span className="info-label">Fare:</span>
                    <span className="info-value fare-amount">₹{ride.fare}</span>
                  </div>
                </div>
                {ride.status === 'COMPLETED' && (
                  <>
                    <div className="info-row">
                      <div className="info-item">
                        <span className="info-label">Payment Method:</span>
                        <span className="info-value">{ride.paymentMethod || 'Not specified'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Payment Status:</span>
                        <span className="info-value">{ride.paymentStatus || 'Pending'}</span>
                      </div>
                    </div>
                    {ride.ratingScore && (
                      <div className="info-row">
                        <div className="info-item">
                          <span className="info-label">Rating:</span>
                          <span className="info-value rating">
                            {'⭐'.repeat(ride.ratingScore)} ({ride.ratingScore}/5)
                          </span>
                        </div>
                        {ride.ratingComment && (
                          <div className="info-item">
                            <span className="info-label">Feedback:</span>
                            <span className="info-value">{ride.ratingComment}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {ride.status === 'COMPLETED' && (
                <div className="ride-actions">
                  <span className="earnings-badge">+ ₹{ride.fare} earned</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
