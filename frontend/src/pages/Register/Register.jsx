import './Register.css';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function Register() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState('USER');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    vehicleDetails: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Set initial role based on URL parameter
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'driver') {
      setRole('DRIVER');
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Basic input sanitization
    let sanitizedValue = value;
    
    if (name === 'name') {
      // Allow only letters, spaces, and common name characters
      sanitizedValue = value.replace(/[^a-zA-Z\s'-]/g, '');
    } else if (name === 'phone') {
      // Allow only numbers
      sanitizedValue = value.replace(/\D/g, '');
    } else if (name === 'email') {
      // Convert to lowercase and trim
      sanitizedValue = value.toLowerCase().trim();
    }
    
    setForm({ ...form, [name]: sanitizedValue });
  };

  const validate = () => {
    const errors = {};
    // Name
    if (!form.name || form.name.trim().length < 2) {
      errors.name = 'Min 2 characters required';
    }
    // Email
    if (!form.email) {
      errors.email = 'Required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = 'Invalid format';
    }
    // Phone
    if (!form.phone) {
      errors.phone = 'Required';
    } else if (!/^\d{10}$/.test(form.phone)) {
      errors.phone = 'Must be 10 digits';
    }
    // Password
    if (!form.password) {
      errors.password = 'Password is required';
    } else {
      const passwordErrors = [];
      if (form.password.length < 8) passwordErrors.push('at least 8 characters');
      if (!/(?=.*[a-z])/.test(form.password)) passwordErrors.push('a lowercase letter');
      if (!/(?=.*[A-Z])/.test(form.password)) passwordErrors.push('an uppercase letter');
      if (!/(?=.*\d)/.test(form.password)) passwordErrors.push('a digit');
      if (!/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(form.password)) passwordErrors.push('a special character');
      
      if (passwordErrors.length > 0) {
        errors.password = `Must have: ${passwordErrors.join(', ')}`;
      }
    }
    // Confirm Password
    if (!form.confirmPassword) {
      errors.confirmPassword = 'Required';
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords don\'t match';
    }
    // Driver fields
    if (role === 'DRIVER') {
      if (!form.licenseNumber) {
        errors.licenseNumber = 'Required';
      } else if (!/^[a-zA-Z0-9]{6,15}$/.test(form.licenseNumber)) {
        errors.licenseNumber = '6-15 alphanumeric chars';
      }
      if (!form.vehicleDetails) {
        errors.vehicleDetails = 'Required';
      }
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    const errors = validate();
    if (Object.keys(errors).length) return setFieldErrors(errors);

    setLoading(true);

    try {
      const userData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      };

      if (role === 'USER') {
        await authService.registerUser(userData);
      } else {
        const driverData = {
          ...userData,
          licenseNumber: form.licenseNumber,
          vehicleDetails: form.vehicleDetails,
        };
        await authService.registerDriver(driverData);
      }

      alert('Registration successful! Please login to continue.');
      // Navigate to login with appropriate role parameter
      if (role === 'DRIVER') {
        navigate('/login?role=driver');
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || err.response?.data || 'Registration failed. Please try again.';
      
      // Handle specific error cases
      if (errorMessage.toLowerCase().includes('email already exists') || 
          errorMessage.toLowerCase().includes('already exists')) {
        setError('Email already registered. Please use a different email or try logging in.');
      } else if (errorMessage.toLowerCase().includes('license')) {
        setError('Invalid license number or license already registered.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-container">
      <div className="form-content">
        <div className="form-heading">Register as {role}</div>
        <div className="form-card">
          <form onSubmit={handleSubmit} className="form">
            <select value={role} onChange={(e) => setRole(e.target.value)} className="form-select">
              <option value="USER">User</option>
              <option value="DRIVER">Driver</option>
            </select>

            <div className="form-group">
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g., Bruce Wayne" />
              {fieldErrors.name && <p className="error">{fieldErrors.name}</p>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g., batman@gotham.com" />
              {fieldErrors.email && <p className="error">{fieldErrors.email}</p>}
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="e.g., 9876543210" />
              {fieldErrors.phone && <p className="error">{fieldErrors.phone}</p>}
            </div>

            {role === 'DRIVER' && (
              <>
                <div className="form-group">
                  <label>License Number</label>
                  <input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} placeholder="e.g., BAT123MAN" />
                  {fieldErrors.licenseNumber && <p className="error">{fieldErrors.licenseNumber}</p>}
                </div>

                <div className="form-group">
                  <label>Vehicle Details</label>
                  <input name="vehicleDetails" value={form.vehicleDetails} onChange={handleChange} placeholder="e.g., Batmobile, Black, 2025" />
                  {fieldErrors.vehicleDetails && <p className="error">{fieldErrors.vehicleDetails}</p>}
                </div>
              </>
            )}

            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="e.g., AlfredKnows!23" />
              {fieldErrors.password && <p className="error">{fieldErrors.password}</p>}
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter your secret!" />
              {fieldErrors.confirmPassword && <p className="error">{fieldErrors.confirmPassword}</p>}
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className="form-link">
            Already have an account? <a href="/login" className="form-link-a">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}
