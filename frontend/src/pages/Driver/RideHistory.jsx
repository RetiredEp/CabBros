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
          {/* Stats Section */}
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
                <div className="stat-label">Completed</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❌</div>
              <div className="stat-details">
                <div className="stat-value">{getFilteredCount('CANCELLED')}</div>
                <div className="stat-label">Cancelled</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-details">
                <div className="stat-value">{rides.length}</div>
                <div className="stat-label">Total Rides</div>
              </div>
            </div>
          </div>

          {rides.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🚗</div>
              <h3>No rides yet</h3>
              <p>Your completed rides will appear here</p>
              <button onClick={() => navigate('/driver/availability')} className="btn btn-primary">
                Go Online to Accept Rides
              </button>
            </div>
          ) : (
            <div className="rides-list">
              {rides.map(ride => (
                <div key={ride.rideId} className="ride-card">
                  <div className="ride-header">
                    <div className="ride-id">Ride #{ride.rideId}</div>
                    <div className="ride-status" style={{ color: getStatusColor(ride.status) }}>
                      {ride.status}
                    </div>
                  </div>
                  
                  <div className="ride-details">
                    <div className="location-section">
                      <div className="location-item">
                        <span className="location-label">From:</span>
                        <span className="location-value">{ride.pickupLocation || 'N/A'}</span>
                      </div>
                      <div className="location-item">
                        <span className="location-label">To:</span>
                        <span className="location-value">{ride.dropoffLocation || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div className="ride-meta">
                      <div className="meta-item">
                        <span className="meta-label">Date:</span>
                        <span className="meta-value">
                          {ride.createdAt ? new Date(ride.createdAt).toLocaleDateString() : 
                           ride.requestedAt ? new Date(ride.requestedAt).toLocaleDateString() : 
                           ride.rideDate ? new Date(ride.rideDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Time:</span>
                        <span className="meta-value">
                          {ride.createdAt ? new Date(ride.createdAt).toLocaleTimeString() : 
                           ride.requestedAt ? new Date(ride.requestedAt).toLocaleTimeString() : 
                           ride.rideTime || 'N/A'}
                        </span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Customer:</span>
                        <span className="meta-value">{ride.user?.name || ride.userName || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div className="fare-section">
                      <div className="fare-amount">₹{ride.fare}</div>
                      {ride.status === 'COMPLETED' && (
                        <div className="earnings-badge">+ ₹{ride.fare} earned</div>
                      )}
                    </div>
                    
                    {ride.status === 'COMPLETED' && (
                      <div className="completion-details">
                        <div className="completion-row">
                          <span className="detail-label">Payment Method:</span>
                          <span className="detail-value">{ride.paymentMethod || 'Not specified'}</span>
                        </div>
                        <div className="completion-row">
                          <span className="detail-label">Payment Status:</span>
                          <span className="detail-value">{ride.paymentStatus || 'Pending'}</span>
                        </div>
                        {ride.ratingScore && (
                          <>
                            <div className="completion-row">
                              <span className="detail-label">Rating:</span>
                              <span className="detail-value rating">
                                {'⭐'.repeat(ride.ratingScore)} ({ride.ratingScore}/5)
                              </span>
                            </div>
                            {ride.ratingComment && (
                              <div className="completion-row">
                                <span className="detail-label">Feedback:</span>
                                <span className="detail-value">{ride.ratingComment}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: var(--surface-color);
          border-radius: var(--border-radius);
          border: 1px solid var(--border-color);
        }

        .stat-icon {
          font-size: 2rem;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--primary-color);
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .rides-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .ride-card {
          background: var(--surface-color);
          border-radius: var(--border-radius);
          border: 1px solid var(--border-color);
          padding: 1.5rem;
          transition: var(--transition);
        }

        .ride-card:hover {
          border-color: var(--primary-color);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .ride-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .ride-id {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 1.1rem;
        }

        .ride-status {
          font-weight: 600;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          background: rgba(0, 0, 0, 0.1);
          font-size: 0.8rem;
          text-transform: uppercase;
        }

        .location-section {
          margin-bottom: 1rem;
        }

        .location-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .location-label {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .location-value {
          color: var(--text-primary);
          font-weight: 600;
        }

        .ride-meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .meta-label {
          color: var(--text-secondary);
          font-size: 0.8rem;
          text-transform: uppercase;
          font-weight: 500;
        }

        .meta-value {
          color: var(--text-primary);
          font-weight: 500;
        }

        .fare-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .fare-amount {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--success-color);
        }

        .earnings-badge {
          background: var(--success-color);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .completion-details {
          border-top: 1px solid var(--border-color);
          padding-top: 1rem;
          margin-top: 1rem;
        }

        .completion-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .detail-label {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .detail-value {
          color: var(--text-primary);
          font-weight: 500;
        }

        .rating {
          color: var(--warning-color);
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .ride-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .fare-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .completion-row {
            flex-direction: column;
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}
