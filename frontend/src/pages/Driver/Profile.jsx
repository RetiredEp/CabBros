import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

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


  if (loading) return <div className="container text-center"><div className="spinner"></div><p>Loading profile...</p></div>;
  if (error) return <div className="container text-center error-message">{error}</div>;

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1>Driver Profile</h1>
          <button onClick={() => navigate('/driver/dashboard')} className="btn btn-secondary">
            ← Dashboard
          </button>
        </div>

        <div className="card-content">
          <div className="profile-section">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {driver?.name?.charAt(0).toUpperCase() || 'D'}
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{driver?.name || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{driver?.phone || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">License Number:</span>
                <span className="detail-value">{driver?.licenseNumber || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Vehicle Details:</span>
                <span className="detail-value">{driver?.vehicleDetails || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Driver ID:</span>
                <span className="detail-value">#{driver?.driverId || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="vehicle-section">
            <h3 className="section-title">Vehicle Information</h3>
            <div className="vehicle-card">
              <div className="vehicle-icon">🚗</div>
              <div className="vehicle-info">
                <div className="vehicle-main">{driver?.vehicleDetails || 'No vehicle details available'}</div>
                <div className="vehicle-meta">
                  <span>License: {driver?.licenseNumber || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-section {
          margin-bottom: 2rem;
          text-align: center;
        }

        .profile-avatar {
          margin-bottom: 1.5rem;
        }

        .avatar-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: bold;
          margin: 0 auto;
        }

        .profile-details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: var(--surface-color);
          border-radius: var(--border-radius);
          border: 1px solid var(--border-color);
        }

        .detail-label {
          font-weight: 600;
          color: var(--text-secondary);
        }

        .detail-value {
          color: var(--text-primary);
          font-weight: 500;
        }

        .vehicle-section {
          margin-top: 2rem;
        }

        .section-title {
          color: var(--text-primary);
          margin-bottom: 1rem;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .vehicle-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: var(--surface-color);
          border-radius: var(--border-radius);
          border: 1px solid var(--border-color);
        }

        .vehicle-icon {
          font-size: 2rem;
        }

        .vehicle-info {
          flex: 1;
        }

        .vehicle-main {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .vehicle-meta {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .detail-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .vehicle-card {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
