import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './Profile.css';

export default function DriverProfile() {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await authService.getDriverProfile();
      setDriver(profile);
    } catch (err) {
      console.error(err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h1>Driver Profile</h1>
        <button onClick={() => navigate('/driver/dashboard')} className="back-btn">
          ← Dashboard
        </button>
      </header>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {driver?.name?.charAt(0).toUpperCase()}
            </div>

          </div>

          <div className="profile-info">
            <div className="profile-details">
              <div className="detail-item">
                <span className="label">Name:</span>
                <span className="value">{driver?.name}</span>
              </div>
              <div className="detail-item">
                <span className="label">Phone:</span>
                <span className="value">{driver?.phone}</span>
              </div>
              <div className="detail-item">
                <span className="label">License Number:</span>
                <span className="value">{driver?.licenseNumber}</span>
              </div>
              <div className="detail-item">
                <span className="label">Vehicle Details:</span>
                <span className="value">{driver?.vehicleDetails}</span>
              </div>
              <div className="detail-item">
                <span className="label">Driver ID:</span>
                <span className="value">#{driver?.driverId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="vehicle-card">
          <h3>Vehicle Information</h3>
          <div className="vehicle-details">
            <div className="vehicle-icon">🚗</div>
            <div className="vehicle-info">
              <div className="vehicle-main">{driver?.vehicleDetails || 'No vehicle details available'}</div>
              <div className="vehicle-meta">
                <span>License: {driver?.licenseNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
