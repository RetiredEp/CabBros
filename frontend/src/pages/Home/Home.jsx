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
        <h1>🚕 CabBooking</h1>
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
              Your Ride, <span className="text-accent">Just a Tap Away</span>
            </h1>
            <p className="text-secondary mb-lg" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              Experience safe, reliable, and affordable rides with our modern cab booking platform. 
              Whether you're a passenger or a driver, we've got you covered.
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
          <h2 className="heading-lg text-center">Why Choose Us?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
            <div className="text-center">
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>🛡️</div>
              <h3 className="heading-sm">Safe & Secure</h3>
              <p className="text-secondary">Verified drivers and secure payment options ensure your safety and peace of mind.</p>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>⚡</div>
              <h3 className="heading-sm">Quick Rides</h3>
              <p className="text-secondary">Find nearby drivers instantly and get to your destination without delays.</p>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>💳</div>
              <h3 className="heading-sm">Easy Payments</h3>
              <p className="text-secondary">Multiple payment options including cash, card, and digital wallets.</p>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>📱</div>
              <h3 className="heading-sm">User Friendly</h3>
              <p className="text-secondary">Intuitive interface that makes booking rides effortless for everyone.</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="heading-lg text-center">How It Works</h2>
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
              <h3 className="heading-sm">Set Your Location</h3>
              <p className="text-secondary">Enter your pickup and drop-off locations</p>
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
              <h3 className="heading-sm">Choose Your Ride</h3>
              <p className="text-secondary">Select from available drivers and confirm your booking</p>
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
              <h3 className="heading-sm">Enjoy Your Trip</h3>
              <p className="text-secondary">Sit back and enjoy a comfortable ride to your destination</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="card">
        <div className="text-center">
          <h3 className="text-accent mb-md">🚕 CabBooking</h3>
          <p className="text-secondary mb-lg">Making transportation simple and reliable for everyone.</p>
          <p className="text-muted">&copy; 2025 CabBooking System. Built with React & Spring Boot.</p>
        </div>
      </footer>
    </div>
  );
}
