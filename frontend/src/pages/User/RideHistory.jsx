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

  if (loading) return (
    <div className="page-container">
      <div className="loading">Loading ride history...</div>
    </div>
  );
  
  if (error) return (
    <div className="page-container">
      <div className="message message-error">{error}</div>
    </div>
  );

  return (
    <div className="page-container">
      <header className="header">
        <h1>Ride History</h1>
        <button onClick={() => navigate('/user/dashboard')} className="btn btn-secondary">
          ← Dashboard
        </button>
      </header>

      <div className="page-content">
        {rides.length === 0 ? (
          <div className="card text-center">
            <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>🚗</div>
            <h2 className="heading-lg">No rides yet</h2>
            <p className="text-secondary mb-lg">Your completed rides will appear here</p>
            <button onClick={() => navigate('/user/book')} className="btn btn-primary btn-lg">
              Book Your First Ride
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            {rides.map((ride) => (
              <div key={ride.rideId} className="ride-card">
                <div className="flex justify-between items-center mb-md">
                  <div className="heading-sm">Ride #{ride.rideId}</div>
                  <div className={`status-badge status-${ride.status.toLowerCase()}`}>
                    {ride.status}
                  </div>
                </div>
                
                <div className="mb-md">
                  <div className="flex items-center gap-md mb-sm">
                    <div style={{ fontSize: '1.2rem' }}>📍</div>
                    <div>
                      <div className="text-secondary" style={{ fontSize: '0.8rem' }}>Pickup</div>
                      <div className="text-primary">{ride.pickupLocation}</div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    width: '2px', 
                    height: '20px', 
                    background: 'var(--bg-tertiary)', 
                    marginLeft: '10px', 
                    marginBottom: 'var(--spacing-sm)' 
                  }}></div>
                  
                  <div className="flex items-center gap-md">
                    <div style={{ fontSize: '1.2rem' }}>🏁</div>
                    <div>
                      <div className="text-secondary" style={{ fontSize: '0.8rem' }}>Dropoff</div>
                      <div className="text-primary">{ride.dropoffLocation}</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                  <div>
                    <div className="text-secondary" style={{ fontSize: '0.8rem' }}>Date</div>
                    <div className="text-primary">{new Date(ride.createdAt || ride.requestedAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-secondary" style={{ fontSize: '0.8rem' }}>Distance</div>
                    <div className="text-primary">{ride.distance} km</div>
                  </div>
                  <div>
                    <div className="text-secondary" style={{ fontSize: '0.8rem' }}>Fare</div>
                    <div className="text-accent font-weight: bold">₹{ride.fare}</div>
                  </div>
                  {ride.driver && (
                    <div>
                      <div className="text-secondary" style={{ fontSize: '0.8rem' }}>Driver</div>
                      <div className="text-primary">{ride.driver.name}</div>
                    </div>
                  )}
                </div>

                {ride.status === 'COMPLETED' && (
                  <div style={{ 
                    borderTop: '1px solid var(--bg-tertiary)', 
                    paddingTop: 'var(--spacing-md)',
                    display: 'grid',
                    gap: 'var(--spacing-sm)'
                  }}>
                    <div className="flex justify-between">
                      <span className="text-secondary">Payment Method:</span>
                      <span className="text-primary">{ride.paymentMethod || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary">Payment Status:</span>
                      <span className="text-primary">{ride.paymentStatus || 'Pending'}</span>
                    </div>
                    {ride.ratingScore && (
                      <div className="flex justify-between">
                        <span className="text-secondary">Rating Given:</span>
                        <span className="text-accent">
                          {'★'.repeat(ride.ratingScore)}{'☆'.repeat(5-ride.ratingScore)} ({ride.ratingScore}/5)
                        </span>
                      </div>
                    )}
                    {ride.ratingComment && (
                      <div>
                        <div className="text-secondary mb-sm">Review:</div>
                        <div className="text-primary" style={{ fontStyle: 'italic' }}>"{ride.ratingComment}"</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
