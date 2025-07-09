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
      <div className="container text-center">
        <div className="spinner"></div>
        <p>Loading current ride...</p>
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="container text-center">
        <div className="card">
          <h2 className="heading-lg">No Active Ride</h2>
          <p className="text-secondary mb-lg">You don't have any active rides at the moment.</p>
          <button onClick={() => navigate('/driver/dashboard')} className="btn btn-primary">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return { icon: '🚗', message: 'Head to pickup location', color: 'var(--info)' };
      case 'IN_PROGRESS':
        return { icon: '🛣️', message: 'Trip in progress', color: 'var(--warning)' };
      case 'COMPLETED':
        return { icon: '✅', message: 'Ride completed', color: 'var(--success)' };
      default:
        return { icon: '📍', message: status, color: 'var(--text-secondary)' };
    }
  };

  const statusInfo = getStatusInfo(ride.status);

  if (showCompletionMessage) {
    return (
      <div className="container text-center">
        <div className="card">
          <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>🎉</div>
          <h2 className="heading-lg">Ride Completed!</h2>
          <p className="text-secondary mb-lg">Great job! You've successfully completed the ride.</p>
          <div className="text-accent" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            +₹{ride.fare} earned
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1>Current Ride</h1>
          <button onClick={() => navigate('/driver/dashboard')} className="btn btn-secondary">
            ← Dashboard
          </button>
        </div>

        <div className="card-content">
          {/* Status Section */}
          <div className="status-section">
            <div className="status-header">
              <div style={{ fontSize: '2rem' }}>{statusInfo.icon}</div>
              <div>
                <div className="heading-md">{statusInfo.message}</div>
                <div className="text-secondary">Ride #{ride.rideId}</div>
              </div>
              <div className="status-badge" style={{ background: statusInfo.color }}>
                {ride.status}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="main-grid">
            {/* Left Column - Passenger & Route */}
            <div className="left-column">
              {/* Passenger Information */}
              <div className="info-card">
                <h3 className="card-title">Passenger</h3>
                <div className="passenger-details">
                  <div className="passenger-avatar">
                    {ride.user?.name?.charAt(0).toUpperCase() || 'P'}
                  </div>
                  <div className="passenger-info">
                    <div className="passenger-name">{ride.user?.name || 'Unknown'}</div>
                    <div className="passenger-phone">{ride.user?.phone || 'No phone'}</div>
                  </div>
                  <div className="contact-actions">
                    <button className="btn btn-secondary btn-sm">📞</button>
                    <button className="btn btn-secondary btn-sm">💬</button>
                  </div>
                </div>
              </div>

              {/* Route Information */}
              <div className="info-card">
                <h3 className="card-title">Route</h3>
                <div className="route-container">
                  <div className="route-point">
                    <div className="route-icon">📍</div>
                    <div className="route-details">
                      <div className="route-label">Pickup</div>
                      <div className="route-address">{ride.pickupLocation || 'Location not available'}</div>
                    </div>
                    <button 
                      className="btn btn-accent btn-sm" 
                      onClick={() => openNavigation(ride.pickupLocation)}
                    >
                      🧭
                    </button>
                  </div>
                  
                  <div className="route-line"></div>
                  
                  <div className="route-point">
                    <div className="route-icon">🏁</div>
                    <div className="route-details">
                      <div className="route-label">Destination</div>
                      <div className="route-address">{ride.dropoffLocation || 'Location not available'}</div>
                    </div>
                    <button 
                      className="btn btn-accent btn-sm" 
                      onClick={() => openNavigation(ride.dropoffLocation)}
                    >
                      🧭
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Trip Info & Actions */}
            <div className="right-column">
              {/* Trip Statistics */}
              <div className="info-card">
                <h3 className="card-title">Trip Details</h3>
                <div className="trip-stats">
                  <div className="stat-item">
                    <div className="stat-icon">📏</div>
                    <div className="stat-details">
                      <div className="stat-label">Distance</div>
                      <div className="stat-value">{ride.distance || 0} km</div>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">💰</div>
                    <div className="stat-details">
                      <div className="stat-label">Fare</div>
                      <div className="stat-value accent">₹{ride.fare || 0}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Card */}
              {ride.status === 'ACCEPTED' && (
                <div className="action-card">
                  <div className="action-icon">🚀</div>
                  <h4>Ready to start?</h4>
                  <p className="action-description">Head to pickup location and start the trip when passenger is ready.</p>
                  <button onClick={startRide} className="btn btn-primary btn-lg full-width">
                    Start Trip
                  </button>
                </div>
              )}
              
              {ride.status === 'IN_PROGRESS' && (
                <div className="action-card in-progress">
                  <div className="action-icon">🛣️</div>
                  <h4>Trip in progress</h4>
                  <p className="action-description">Drive safely to destination. Complete when you arrive.</p>
                  <button onClick={completeRide} className="btn btn-success btn-lg full-width">
                    Complete Trip
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .status-section {
          margin-bottom: 2rem;
        }

        .status-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: var(--surface-color);
          border-radius: var(--border-radius);
          border: 1px solid var(--border-color);
        }

        .status-header > div:nth-child(2) {
          flex: 1;
        }

        .status-badge {
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 1rem;
        }

        .left-column,
        .right-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .info-card {
          background: var(--surface-color);
          border-radius: var(--border-radius);
          border: 1px solid var(--border-color);
          padding: 1.5rem;
        }

        .card-title {
          color: var(--text-primary);
          margin-bottom: 1rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.5rem;
        }

        .passenger-details {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .passenger-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: bold;
          flex-shrink: 0;
        }

        .passenger-info {
          flex: 1;
        }

        .passenger-name {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .passenger-phone {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .contact-actions {
          display: flex;
          gap: 0.5rem;
        }

        .route-container {
          display: flex;
          flex-direction: column;
        }

        .route-point {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 0;
        }

        .route-icon {
          font-size: 1.25rem;
          width: 30px;
          text-align: center;
          flex-shrink: 0;
        }

        .route-details {
          flex: 1;
        }

        .route-label {
          color: var(--text-secondary);
          font-size: 0.8rem;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .route-address {
          color: var(--text-primary);
          font-weight: 500;
          font-size: 0.9rem;
        }

        .route-line {
          width: 2px;
          height: 20px;
          background: var(--border-color);
          margin: 0.5rem 0 0.5rem 15px;
        }

        .trip-stats {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--bg-primary);
          border-radius: var(--border-radius);
          border: 1px solid var(--border-color);
        }

        .stat-icon {
          font-size: 1.5rem;
          width: 40px;
          text-align: center;
        }

        .stat-details {
          flex: 1;
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: 0.8rem;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          color: var(--text-primary);
          font-size: 1.25rem;
          font-weight: bold;
        }

        .stat-value.accent {
          color: var(--accent-primary);
        }

        .action-card {
          background: var(--surface-color);
          border-radius: var(--border-radius);
          border: 1px solid var(--border-color);
          padding: 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .action-card.in-progress {
          background: linear-gradient(135deg, var(--surface-color) 0%, rgba(255, 152, 0, 0.1) 100%);
          border-color: var(--warning);
        }

        .action-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          display: block;
        }

        .action-card h4 {
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
        }

        .action-description {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .main-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .status-header {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .passenger-details {
            flex-direction: column;
            text-align: center;
          }

          .route-point {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }

          .route-line {
            margin: 0.5rem auto;
          }

          .contact-actions {
            justify-content: center;
          }

          .stat-item {
            justify-content: center;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
