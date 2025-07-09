import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { rideService } from '../../services/rideService';

export default function RideHistory() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadRideHistory();
  }, []);

  const loadRideHistory = async () => {
    try {
      const history = await rideService.getRideHistory();
      setRides(history);
    } catch (err) {
      console.error(err);
      setError('Failed to load ride history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return '#28a745';
      case 'CANCELLED': return '#dc3545';
      case 'IN_PROGRESS': return '#ffc107';
      default: return '#6c757d';
    }
  };

  if (loading) return <div className="loading">Loading ride history...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="history-container">
      <header className="history-header">
        <h1>Ride History</h1>
        <button onClick={() => navigate('/user/dashboard')} className="back-btn">
          ← Dashboard
        </button>
      </header>

      {rides.length === 0 ? (
        <div className="no-rides">
          <div className="no-rides-icon">🚗</div>
          <h2>No rides yet</h2>
          <p>Your completed rides will appear here</p>
          <button onClick={() => navigate('/user/book')} className="book-first-ride-btn">
            Book Your First Ride
          </button>
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
                <div className="info-item">
                  <span className="info-label">Date:</span>
                  <span className="info-value">
                    {new Date(ride.createdAt || ride.requestedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Distance:</span>
                  <span className="info-value">{ride.distance} km</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Fare:</span>
                  <span className="info-value">₹{ride.fare}</span>
                </div>
                {ride.driver && (
                  <div className="info-item">
                    <span className="info-label">Driver:</span>
                    <span className="info-value">{ride.driver.name}</span>
                  </div>
                )}
              </div>

              {ride.status === 'COMPLETED' && (
                <div className="ride-completion-details">
                  <div className="completion-row">
                    <div className="completion-item">
                      <span className="completion-label">Payment Method:</span>
                      <span className="completion-value">{ride.paymentMethod || 'Not specified'}</span>
                    </div>
                    <div className="completion-item">
                      <span className="completion-label">Payment Status:</span>
                      <span className="completion-value">{ride.paymentStatus || 'Pending'}</span>
                    </div>
                  </div>
                  {ride.ratingScore && (
                    <div className="completion-row">
                      <div className="completion-item">
                        <span className="completion-label">Rating Given:</span>
                        <span className="completion-value">
                          {'★'.repeat(ride.ratingScore)}{'☆'.repeat(5-ride.ratingScore)} ({ride.ratingScore}/5)
                        </span>
                      </div>
                    </div>
                  )}
                  {ride.ratingComment && (
                    <div className="completion-row">
                      <div className="completion-item">
                        <span className="completion-label">Review:</span>
                        <span className="completion-value review-text">"{ride.ratingComment}"</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .history-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .back-btn {
          background: #6c757d;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
        }

        .no-rides {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .no-rides-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .book-first-ride-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 20px;
        }

        .rides-list {
          space-y: 20px;
        }

        .ride-card {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 25px;
          margin-bottom: 20px;
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

        .ride-status {
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .ride-route {
          margin-bottom: 20px;
        }

        .route-point {
          display: flex;
          align-items: flex-start;
          margin-bottom: 10px;
        }

        .route-icon {
          width: 30px;
          text-align: center;
          font-size: 16px;
          margin-right: 15px;
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
          margin-bottom: 2px;
        }

        .route-location {
          color: #333;
          font-size: 14px;
        }

        .route-line {
          width: 2px;
          height: 20px;
          background: #ddd;
          margin-left: 14px;
          margin-bottom: 10px;
        }

        .ride-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .info-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
        }

        .info-value {
          color: #333;
          font-weight: 500;
        }

        .ride-actions {
          display: flex;
          gap: 10px;
        }

        .view-receipt-btn, .rate-ride-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .view-receipt-btn {
          background: #007bff;
          color: white;
        }

        .rate-ride-btn {
          background: #ffc107;
          color: #333;
        }

        .loading, .error {
          text-align: center;
          padding: 40px;
          font-size: 18px;
        }

        .error {
          color: #e74c3c;
        }

        .ride-completion-details {
          margin-top: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #28a745;
        }

        .completion-row {
          display: flex;
          gap: 20px;
          margin-bottom: 10px;
        }

        .completion-row:last-child {
          margin-bottom: 0;
        }

        .completion-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .completion-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
        }

        .completion-value {
          color: #333;
          font-weight: 500;
        }

        .review-text {
          font-style: italic;
          color: #555;
          padding: 8px;
          background: white;
          border-radius: 4px;
          border: 1px solid #ddd;
        }
      `}</style>
    </div>
  );
}
