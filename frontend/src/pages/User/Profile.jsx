import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

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

  if (loading) return (
    <div className="page-container">
      <div className="loading">Loading profile...</div>
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
        <h1>My Profile</h1>
        <button onClick={() => navigate('/user/dashboard')} className="btn btn-secondary">
          ← Dashboard
        </button>
      </header>

      <div className="page-content">
        <div className="card">
          <div className="text-center mb-lg">
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--accent-primary)',
              color: 'var(--text-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              margin: '0 auto'
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="profile-info">
            <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
              <div className="flex justify-between">
                <span className="text-secondary">Name:</span>
                <span className="text-primary font-weight: 600">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Email:</span>
                <span className="text-primary font-weight: 600">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Phone:</span>
                <span className="text-primary font-weight: 600">{user?.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Role:</span>
                <span className="text-accent font-weight: 600">{user?.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Member Since:</span>
                <span className="text-primary font-weight: 600">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
