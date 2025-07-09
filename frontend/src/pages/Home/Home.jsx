// src/pages/Home/Home.jsx
import './Home.css';
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
    <div className="home-container">
      <header className="home-header">
        <div className="logo-section">
          <h1 className="logo-text">🚕 CabBooking</h1>
        </div>
        <nav className="nav-section">
          {isAuthenticated ? (
            <div className="auth-nav">
              <span className="welcome-text">Welcome back!</span>
              <button onClick={handleGetStarted} className="nav-btn primary">
                Dashboard
              </button>
              <button onClick={handleLogout} className="nav-btn secondary">
                Logout
              </button>
            </div>
          ) : (
            <div className="guest-nav">
              <button onClick={() => navigate('/login')} className="nav-btn secondary">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="nav-btn primary">
                Sign Up
              </button>
            </div>
          )}
        </nav>
      </header>

      <main className="home-content">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Your Ride, <span className="highlight">Just a Tap Away</span>
            </h1>
            <p className="hero-description">
              Experience safe, reliable, and affordable rides with our modern cab booking platform. 
              Whether you're a passenger or a driver, we've got you covered.
            </p>
            <div className="hero-actions">
              <button onClick={handleGetStarted} className="cta-btn primary">
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              </button>
              {!isAuthenticated && (
                <button onClick={() => navigate('/register?role=driver')} className="cta-btn secondary">
                  Join as Driver
                </button>
              )}
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-card">
              <div className="card-icon">🚗</div>
              <div className="card-content">
                <h3>Quick Booking</h3>
                <p>Book rides in seconds</p>
              </div>
            </div>
            <div className="floating-card">
              <div className="card-icon">📍</div>
              <div className="card-content">
                <h3>Live Tracking</h3>
                <p>Track your ride in real-time</p>
              </div>
            </div>
            <div className="floating-card">
              <div className="card-icon">💰</div>
              <div className="card-content">
                <h3>Fair Pricing</h3>
                <p>Transparent fare calculation</p>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="container">
            <h2 className="section-title">Why Choose Us?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🛡️</div>
                <h3>Safe & Secure</h3>
                <p>Verified drivers and secure payment options ensure your safety and peace of mind.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Quick Rides</h3>
                <p>Find nearby drivers instantly and get to your destination without delays.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💳</div>
                <h3>Easy Payments</h3>
                <p>Multiple payment options including cash, card, and digital wallets.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3>User Friendly</h3>
                <p>Intuitive interface that makes booking rides effortless for everyone.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="how-it-works">
          <div className="container">
            <h2 className="section-title">How It Works</h2>
            <div className="steps-container">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Set Your Location</h3>
                <p>Enter your pickup and drop-off locations</p>
              </div>
              <div className="step-arrow">→</div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>Choose Your Ride</h3>
                <p>Select from available drivers and confirm your booking</p>
              </div>
              <div className="step-arrow">→</div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Enjoy Your Trip</h3>
                <p>Sit back and enjoy a comfortable ride to your destination</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>🚕 CabBooking</h3>
              <p>Making transportation simple and reliable for everyone.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#help">Help Center</a></li>
                <li><a href="#safety">Safety</a></li>
                <li><a href="#terms">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 CabBooking System. Built with React & Spring Boot.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
