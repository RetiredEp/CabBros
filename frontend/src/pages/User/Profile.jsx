import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './Profile.css';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await authService.getUserProfile();
      setUser(profile);
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
        <h1>My Profile</h1>
        <button onClick={() => navigate('/user/dashboard')} className="back-btn">
          ← Dashboard
        </button>
      </header>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="profile-info">
            <div className="profile-details">
              <div className="detail-item">
                <span className="label">Name:</span>
                <span className="value">{user?.name}</span>
              </div>
              <div className="detail-item">
                <span className="label">Email:</span>
                <span className="value">{user?.email}</span>
              </div>
              <div className="detail-item">
                <span className="label">Phone:</span>
                <span className="value">{user?.phone}</span>
              </div>
              <div className="detail-item">
                <span className="label">Role:</span>
                <span className="value">{user?.role}</span>
              </div>
              <div className="detail-item">
                <span className="label">Member Since:</span>
                <span className="value">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
