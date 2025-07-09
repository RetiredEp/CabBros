import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { rideService } from '../../services/rideService';

export default function DriverCurrentRide() {
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const navigate = useNavigate();

  // Function to open Google Maps navigation
  const openNavigation = (destination) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    loadCurrentRide();
    // Poll for updates every 5 seconds
    const interval = setInterval(loadCurrentRide, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadCurrentRide = async () => {
    try {
      const currentRide = await rideService.getDriverCurrentRide();
      setRide(currentRide);
    } catch (err) {
      console.error(err);
      setError('No active ride found');
    } finally {
      setLoading(false);
    }
  };

  const updateRideStatus = async (newStatus) => {
    try {
      await rideService.updateRideStatus(newStatus);
      await loadCurrentRide(); // Refresh ride data
    } catch (err) {
      console.error(err);
      alert('Failed to update ride status');
    }
  };

  const startRide = () => updateRideStatus('IN_PROGRESS');
  
  const completeRide = async () => {
    try {
      await rideService.updateRideStatus('COMPLETED');
      setShowCompletionMessage(true);
      
      // Show completion message for 3 seconds then redirect
      setTimeout(() => {
        navigate('/driver/dashboard');
      }, 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to complete ride');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading current ride...</p>
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="error-container">
        <h2>No Active Ride</h2>
        <p>You don't have any active rides at the moment.</p>
        <button onClick={() => navigate('/driver/dashboard')} className="dashboard-btn">
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="current-ride-container">
      <header className="ride-header">
        <h1>Current Ride</h1>
        <button onClick={() => navigate('/driver/dashboard')} className="back-btn">
          ← Dashboard
        </button>
      </header>

      <div className="ride-content">
        <div className="ride-status-card">
          <div className="status-indicator">
            <div className={`status-dot ${ride.status.toLowerCase()}`}></div>
            <span className="status-text">{ride.status}</span>
          </div>
          <div className="ride-id">Ride #{ride.rideId}</div>
        </div>

        <div className="user-info-card">
          <h3>Passenger Information</h3>
          <div className="user-details">
            <div className="user-avatar">
              {ride.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-name">{ride.user?.name}</div>
              <div className="user-phone">{ride.user?.phone}</div>
            </div>
            <div className="contact-actions">
              <button className="call-btn">📞 Call</button>
              <button className="message-btn">💬 Message</button>
            </div>
          </div>
        </div>

        <div className="ride-details-card">
          <h3>Trip Details</h3>
          <div className="route-section">
            <div className="route-point">
              <div className="route-icon pickup">📍</div>
              <div className="route-info">
                <div className="route-label">Pickup Location</div>
                <div className="route-address">{ride.pickupLocation}</div>
              </div>
              <button className="navigate-btn" onClick={() => openNavigation(ride.pickupLocation)}>🧭 Navigate</button>
            </div>
            
            <div className="route-line"></div>
            
            <div className="route-point">
              <div className="route-icon dropoff">🏁</div>
              <div className="route-info">
                <div className="route-label">Dropoff Location</div>
                <div className="route-address">{ride.dropoffLocation}</div>
              </div>
              <button className="navigate-btn" onClick={() => openNavigation(ride.dropoffLocation)}>🧭 Navigate</button>
            </div>
          </div>

          <div className="trip-info-grid">
            <div className="info-item">
              <span className="info-label">Distance</span>
              <span className="info-value">{ride.distance} km</span>
            </div>
            <div className="info-item">
              <span className="info-label">Fare</span>
              <span className="info-value">₹{ride.fare}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Started At</span>
              <span className="info-value">
                {ride.acceptedAt ? new Date(ride.acceptedAt).toLocaleTimeString() : 'Not started'}
              </span>
            </div>
          </div>
        </div>

        <div className="ride-actions-card">
          <h3>Ride Actions</h3>
          
          {ride.status === 'ACCEPTED' && (
            <div className="action-section">
              <p>You've accepted this ride. Head to the pickup location and start the trip.</p>
              <button onClick={startRide} className="action-btn start-btn">
                🚗 Start Trip
              </button>
            </div>
          )}

          {ride.status === 'IN_PROGRESS' && (
            <div className="action-section">
              <p>Trip is in progress. Complete the ride when you reach the destination.</p>
              <button onClick={completeRide} className="action-btn complete-btn">
                ✅ Complete Trip
              </button>
            </div>
          )}

          {ride.status === 'COMPLETED' && (
            <div className="action-section">
              {showCompletionMessage ? (
                <div className="completion-message">
                  <div className="success-icon">🎉</div>
                  <h3>Trip Completed Successfully!</h3>
                  <p>Thank you for providing excellent service!</p>
                  <p>Redirecting to dashboard...</p>
                  <div className="celebration-animation">✨</div>
                </div>
              ) : (
                <>
                  <p>✅ Trip completed successfully!</p>
                  <div className="completion-info">
                    <p>Payment: ₹{ride.fare} (Received)</p>
                    <p>Thank you for the safe trip!</p>
                  </div>
                  <button 
                    onClick={() => navigate('/driver/dashboard')} 
                    className="action-btn dashboard-btn"
                  >
                    Return to Dashboard
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .current-ride-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .ride-header {
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

        .ride-status-card, .user-info-card, .ride-details-card, .ride-actions-card {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 25px;
          margin-bottom: 20px;
        }

        .ride-status-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .status-dot.accepted { background: #17a2b8; }
        .status-dot.in_progress { background: #28a745; }
        .status-dot.completed { background: #6f42c1; }

        .status-text {
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .ride-id {
          color: #666;
          font-size: 14px;
        }

        .user-details {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .user-avatar {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          font-weight: bold;
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .user-phone {
          color: #666;
        }

        .contact-actions {
          display: flex;
          gap: 10px;
        }

        .call-btn, .message-btn {
          padding: 10px 15px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .call-btn {
          background: #28a745;
          color: white;
        }

        .message-btn {
          background: #007bff;
          color: white;
        }

        .route-section {
          margin-bottom: 25px;
        }

        .route-point {
          display: flex;
          align-items: flex-start;
          margin-bottom: 15px;
          gap: 15px;
        }

        .route-icon {
          width: 30px;
          text-align: center;
          font-size: 16px;
          margin-top: 2px;
        }

        .route-info {
          flex: 1;
        }

        .route-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .route-address {
          color: #333;
          font-size: 16px;
          line-height: 1.4;
        }

        .navigate-btn {
          background: #ffc107;
          color: #333;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
        }

        .route-line {
          width: 2px;
          height: 25px;
          background: #ddd;
          margin-left: 14px;
          margin-bottom: 15px;
        }

        .trip-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 20px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 10px;
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
          font-size: 18px;
          font-weight: bold;
          color: #333;
        }

        .action-section {
          text-align: center;
        }

        .action-section p {
          margin-bottom: 20px;
          color: #666;
          font-size: 16px;
        }

        .completion-message {
          text-align: center;
          padding: 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .success-icon {
          font-size: 48px;
          margin-bottom: 15px;
          animation: bounce 1s infinite;
        }

        .completion-message h3 {
          margin: 15px 0;
          font-size: 24px;
        }

        .completion-message p {
          margin: 10px 0;
          color: white;
          font-size: 16px;
        }

        .celebration-animation {
          font-size: 24px;
          animation: sparkle 2s infinite;
        }

        .action-btn {
          padding: 15px 30px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 18px;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
          margin: 5px;
        }

        .start-btn {
          background: #28a745;
          color: white;
        }

        .complete-btn {
          background: #6f42c1;
          color: white;
        }

        .dashboard-btn {
          background: #007bff;
          color: white;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        }

        .completion-info {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
        }

        .completion-info p {
          margin: 5px 0;
          color: #155724;
        }

        .loading-container, .error-container {
          text-align: center;
          padding: 60px 20px;
        }

        .spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .current-ride-container {
            padding: 10px;
          }
          
          .ride-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }
          
          .user-details {
            flex-direction: column;
            text-align: center;
          }
          
          .route-point {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
