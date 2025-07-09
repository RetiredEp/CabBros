// src/pages/Home/Home.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authService } from '../../services/authService';

export default function Home() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const authenticated = authService.isAuthenticated();
    const role = authService.getRole();
    setIsAuthenticated(authenticated);
    setUserRole(role);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (userRole === 'USER') {
        navigate('/user/dashboard');
      } else if (userRole === 'DRIVER') {
        navigate('/driver/dashboard');
      }
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <div className="page-container">
      <header className="header">
        <h1>🚕 CabBros</h1>
        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <span className="text-secondary">Welcome back!</span>
              <button onClick={handleGetStarted} className="btn btn-primary">
                Dashboard
              </button>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn btn-secondary">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="btn btn-primary">
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>

      <main className="page-content">
        <div className="card">
          <div className="text-center">
            <h1 className="heading-xl">
              Your Ride, <span className="text-accent">Bros Style</span>
            </h1>
            <p className="text-secondary mb-lg" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              We're just a couple of bros who built a cab app. It actually works (most of the time), 
              has real login forms, and drivers can even toggle their availability! 
              No fancy AI or rocket science - just good old-fashioned ride booking.
            </p>
            <div className="flex gap-md justify-center">
              <button onClick={handleGetStarted} className="btn btn-primary btn-lg">
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              </button>
              {!isAuthenticated && (
                <button onClick={() => navigate('/register?role=driver')} className="btn btn-secondary btn-lg">
                  Join as Driver
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="heading-lg text-center">What We Actually Built</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
            <div className="text-center">
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>�</div>
              <h3 className="heading-sm">Login That Works</h3>
              <p className="text-secondary">Yes, you can actually log in and out! We even validate your email format. Revolutionary stuff.</p>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>🚗</div>
              <h3 className="heading-sm">Real Ride Booking</h3>
              <p className="text-secondary">Book rides, see them in your history, and watch the status change. It's like magic, but it's just React state.</p>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>�</div>
              <h3 className="heading-sm">Driver Availability Toggle</h3>
              <p className="text-secondary">Drivers can go online/offline with our super high-tech toggle button. It even changes colors!</p>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>�</div>
              <h3 className="heading-sm">Payment Method Selection</h3>
              <p className="text-secondary">Choose between Cash, UPI, or Card. We won't actually charge you, but the UI looks convincing.</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="heading-lg text-center">How To Use This Thing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-xl)', textAlign: 'center' }}>
            <div>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: 'var(--accent-primary)', 
                color: 'var(--text-dark)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto var(--spacing-md)', 
                fontSize: '1.5rem', 
                fontWeight: 'bold' 
              }}>1</div>
              <h3 className="heading-sm">Sign Up</h3>
              <p className="text-secondary">Create an account. We'll ask for your email and won't spam you (probably).</p>
            </div>
            <div>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: 'var(--accent-primary)', 
                color: 'var(--text-dark)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto var(--spacing-md)', 
                fontSize: '1.5rem', 
                fontWeight: 'bold' 
              }}>2</div>
              <h3 className="heading-sm">Book a Ride</h3>
              <p className="text-secondary">Type where you're going. Our algorithm will find you a driver (if any are online).</p>
            </div>
            <div>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: 'var(--accent-primary)', 
                color: 'var(--text-dark)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto var(--spacing-md)', 
                fontSize: '1.5rem', 
                fontWeight: 'bold' 
              }}>3</div>
              <h3 className="heading-sm">Pretend to Pay</h3>
              <p className="text-secondary">Select your payment method and feel good about this working demo.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="card">
        <div className="text-center">
          <h3 className="text-accent mb-md">🚕 CabBros</h3>
          <p className="text-secondary mb-lg">Making cab apps one React component at a time.</p>
          <p className="text-muted">&copy; 2025 CabBros. Built by bros, for bros (and everyone else).</p>
        </div>
      </footer>
    </div>
  );
}
