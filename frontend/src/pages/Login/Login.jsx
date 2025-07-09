import './Login.css';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function Login() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState('USER');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Set initial role based on URL parameter
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'driver') {
      setRole('DRIVER');
    }
  }, [searchParams]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('All fields required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (role === 'USER') {
        await authService.loginUser(form);
        // Small delay to ensure token is stored
        setTimeout(() => {
          navigate('/user/dashboard');
        }, 100);
      } else {
        await authService.loginDriver(form);
        // Small delay to ensure token is stored
        setTimeout(() => {
          navigate('/driver/dashboard');
        }, 100);
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || err.response?.data || 'Login failed';
      
      // Handle specific error cases
      if (errorMessage.toLowerCase().includes('invalid email') || 
          errorMessage.toLowerCase().includes('not found')) {
        setError('Email not found. Please check your email or register first.');
      } else if (errorMessage.toLowerCase().includes('invalid password') || 
                 errorMessage.toLowerCase().includes('password')) {
        setError('Incorrect password. Please try again.');
      } else if (errorMessage.toLowerCase().includes('network') || 
                 err.code === 'NETWORK_ERROR') {
        setError('Connection error. Please check your internet and try again.');
      } else {
        setError('Login failed. Please check your credentials.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="form-page-container">
      <div className="form-content">
        <div className="form-heading">Login as {role}</div>
        <div className="form-card">
          <form onSubmit={handleSubmit} className="form">
            <select value={role} onChange={(e) => setRole(e.target.value)} className="form-select">
              <option value="USER">User</option>
              <option value="DRIVER">Driver</option>
            </select>

            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g., batman@gotham.com" />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="e.g., AlfredKnows!23" />
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="form-link">
            Don't have an account? <a href="/register" className="form-link-a">Register</a>
          </div>
        </div>
      </div>
    </div>
  );
}
