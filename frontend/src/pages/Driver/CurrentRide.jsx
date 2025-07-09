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
      <div className="page-container">
        <div className="loading">Loading current ride details...</div>
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="page-container">
        <div className="card text-center">
          <h2 className="heading-lg">No Active Ride</h2>
          <p className="text-secondary mb-lg">You don't have any active rides at the moment.</p>
          <button onClick={() => navigate('/driver/dashboard')} className="btn btn-primary">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getStatusMessage = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return { icon: '🚗', message: 'Head to pickup location', detail: 'Drive to the passenger and start the trip.' };
      case 'IN_PROGRESS':
        return { icon: '🛣️', message: 'Trip in progress', detail: 'Drive safely to the destination.' };
      case 'COMPLETED':
        return { icon: '✅', message: 'Ride completed!', detail: 'Great job completing this ride.' };
      default:
        return { icon: '📍', message: status, detail: '' };
    }
  };

  const statusInfo = getStatusMessage(ride.status);

  if (showCompletionMessage) {
    return (
      <div className="page-container">
        <div className="card text-center">
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
    <div className="page-container">
      <header className="header">
        <h1>Current Ride</h1>
        <button onClick={() => navigate('/driver/dashboard')} className="btn btn-secondary">
          ← Dashboard
        </button>
      </header>

      <div className="page-content">
        {/* Status Card */}
        <div className="card text-center">
          <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>{statusInfo.icon}</div>
          <div className={`status-badge status-${ride.status.toLowerCase()} mb-md`} style={{ fontSize: '0.9rem' }}>
            {ride.status}
          </div>
          <h2 className="heading-md">{statusInfo.message}</h2>
          <p className="text-secondary">{statusInfo.detail}</p>
          <div className="heading-sm mt-md">Ride #{ride.rideId}</div>
        </div>

        {/* Route Details */}
        <div className="card">
          <h3 className="heading-md mb-lg">Route Details</h3>
          
          <div className="mb-lg">
            <div className="flex items-center gap-md mb-md">
              <div style={{ fontSize: '1.2rem' }}>📍</div>
              <div>
                <div className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: '600' }}>PICKUP LOCATION</div>
                <div className="text-primary">{ride.pickupLocation || 'Location not available'}</div>
              </div>
              <button 
                className="btn btn-accent btn-sm" 
                onClick={() => openNavigation(ride.pickupLocation)}
                style={{ marginLeft: 'auto' }}
              >
                🧭 Navigate
              </button>
            </div>
            
            <div style={{ 
              width: '2px', 
              height: '30px', 
              background: 'var(--bg-tertiary)', 
              marginLeft: '10px', 
              marginBottom: 'var(--spacing-md)' 
            }}></div>
            
            <div className="flex items-center gap-md">
              <div style={{ fontSize: '1.2rem' }}>🏁</div>
              <div>
                <div className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: '600' }}>DESTINATION</div>
                <div className="text-primary">{ride.dropoffLocation || 'Location not available'}</div>
              </div>
              <button 
                className="btn btn-accent btn-sm" 
                onClick={() => openNavigation(ride.dropoffLocation)}
                style={{ marginLeft: 'auto' }}
              >
                🧭 Navigate
              </button>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
            gap: 'var(--spacing-md)',
          }}>
            <div className="text-center">
              <div className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: '600' }}>DISTANCE</div>
              <div className="text-primary" style={{ fontSize: '1.1rem', fontWeight: '600' }}>{ride.distance || 0} km</div>
            </div>
            <div className="text-center">
              <div className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: '600' }}>FARE</div>
              <div className="text-accent" style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>₹{ride.fare || 0}</div>
            </div>
          </div>
        </div>

        {/* Passenger Information */}
        <div className="card">
          <h3 className="heading-md mb-lg">Passenger Information</h3>
          <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            <div className="flex justify-between items-center">
              <span className="text-secondary">Name:</span>
              <span className="text-primary" style={{ fontWeight: '600' }}>{ride.user?.name || 'Unknown'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary">Phone:</span>
              <span className="text-primary" style={{ fontWeight: '600' }}>{ride.user?.phone || 'No phone'}</span>
            </div>
            <div className="flex gap-md mt-md">
              <button className="btn btn-secondary">📞 Call</button>
              <button className="btn btn-secondary">💬 Message</button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {ride.status === 'ACCEPTED' && (
          <div className="card text-center">
            <h3 className="heading-md mb-md">Ready to Start Trip?</h3>
            <p className="text-secondary mb-lg">Head to the pickup location and start the trip when the passenger is ready.</p>
            <button onClick={startRide} className="btn btn-primary btn-lg">
              🚀 Start Trip
            </button>
          </div>
        )}
        
        {ride.status === 'IN_PROGRESS' && (
          <div className="card text-center">
            <h3 className="heading-md mb-md">Trip in Progress</h3>
            <p className="text-secondary mb-lg">Drive safely to the destination. Complete the trip when you arrive.</p>
            <button onClick={completeRide} className="btn btn-success btn-lg">
              ✅ Complete Trip
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
