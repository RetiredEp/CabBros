import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { rideService } from "../../services/rideService";
import { paymentService } from "../../services/paymentService";
import { ratingService } from "../../services/ratingService";

function CurrentRide() {
  const [ride, setRide] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('CARD');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const navigate = useNavigate();

  const fetchRide = useCallback(async () => {
    try {
      const rideData = await rideService.getCurrentRide();
      setRide(rideData);
      setError(null);
    } catch (err) {
      console.error('Error fetching ride:', err);
      if (err.response?.status === 404) {
        // If no active ride found and we're not in payment/rating flow, show error
        if (!showPayment && !showRating) {
          setError("No active ride found.");
        }
      } else if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else {
        setError("Failed to load ride details.");
      }
    } finally {
      setLoading(false);
    }
  }, [showPayment, showRating]);

  const handlePayment = async () => {
    if (paymentLoading) return; // Prevent multiple payment attempts
    
    setPaymentLoading(true);
    try {
      const paymentData = {
        rideId: ride.rideId,
        amount: ride.fare,
        method: selectedPaymentMethod
      };
      await paymentService.processPayment(paymentData);
      setShowPayment(false);
      setShowRating(true);
      // Refresh ride data after payment
      await fetchRide();
    } catch (err) {
      console.error(err);
      alert('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleRating = async () => {
    try {
      const ratingData = {
        rideId: ride.rideId,
        driverId: ride.driver?.driverId,
        rating: rating,
        review: review
      };
      await ratingService.submitRating(ratingData);
      alert('Thank you for your feedback!');
      navigate('/user/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to submit rating. Please try again.');
    }
  };

  useEffect(() => {
    fetchRide();
    // Poll for ride updates every 5 seconds, but pause when modals are open
    const interval = setInterval(() => {
      // Don't poll when payment or rating modals are open to avoid interrupting user flow
      if (!showPayment && !showRating) {
        fetchRide();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchRide, showPayment, showRating]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading current ride details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="card text-center">
          <h2 className="heading-lg">{error}</h2>
          <p className="text-secondary mb-lg">You don't have any active rides at the moment.</p>
          <div className="flex gap-md justify-center">
            <button onClick={() => navigate("/user/book")} className="btn btn-primary">
              Book a New Ride
            </button>
            <button onClick={() => navigate("/user/dashboard")} className="btn btn-secondary">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusMessage = (status) => {
    switch (status) {
      case 'REQUESTED':
        return { icon: '🔍', message: 'Searching for nearby drivers...', detail: 'Please wait while we find you a ride.' };
      case 'ACCEPTED':
        return { icon: '🚗', message: 'Driver is on the way to pick you up!', detail: 'Please be ready at the pickup location.' };
      case 'IN_PROGRESS':
        return { icon: '🛣️', message: "You're on your way!", detail: 'Enjoy your ride to the destination.' };
      case 'COMPLETED':
        return { icon: '✅', message: 'Ride completed!', detail: 'Thank you for riding with us.' };
      default:
        return { icon: '📍', message: 'Ride status unknown', detail: '' };
    }
  };

  const statusInfo = getStatusMessage(ride.status);

  return (
    <div className="page-container">
      <header className="header">
        <h1>Current Ride</h1>
        <button onClick={() => navigate('/user/dashboard')} className="btn btn-secondary">
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
                <div className="text-primary">{ride.pickupLocation}</div>
              </div>
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
                <div className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: '600' }}>DROPOFF LOCATION</div>
                <div className="text-primary">{ride.dropoffLocation}</div>
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
            gap: 'var(--spacing-md)',
          }}>
            <div className="text-center">
              <div className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: '600' }}>DISTANCE</div>
              <div className="text-primary" style={{ fontSize: '1.1rem', fontWeight: '600' }}>{ride.distance} km</div>
            </div>
            <div className="text-center">
              <div className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: '600' }}>FARE</div>
              <div className="text-accent" style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>₹{ride.fare}</div>
            </div>
            <div className="text-center">
              <div className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: '600' }}>REQUESTED AT</div>
              <div className="text-primary" style={{ fontSize: '0.9rem' }}>{new Date(ride.requestedAt).toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        {/* Driver Information */}
        {ride.driver && (
          <div className="card">
            <h3 className="heading-md mb-lg">Driver Information</h3>
            <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Name:</span>
                <span className="text-primary" style={{ fontWeight: '600' }}>{ride.driver.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Phone:</span>
                <span className="text-primary" style={{ fontWeight: '600' }}>{ride.driver.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Vehicle:</span>
                <span className="text-primary" style={{ fontWeight: '600' }}>{ride.driver.vehicleDetails}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {ride.status === 'COMPLETED' && !showPayment && !showRating && (
          <div className="card text-center">
            <h3 className="heading-md mb-md">Complete Your Ride</h3>
            <p className="text-secondary mb-lg">Please proceed with payment to finish your ride</p>
            <button onClick={() => setShowPayment(true)} className="btn btn-primary btn-lg">
              💳 Pay Now - ₹{ride.fare}
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '400px', width: '90%', margin: 'var(--spacing-md)' }}>
            <div className="text-center mb-lg">
              <h3 className="heading-lg">Payment</h3>
              <div className="text-accent mb-md" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                ₹{ride.fare}
              </div>
              <p className="text-secondary">Select your payment method</p>
            </div>
            
            {paymentLoading ? (
              <div className="text-center">
                <div style={{
                  width: '50px',
                  height: '50px',
                  border: '3px solid var(--bg-tertiary)',
                  borderTop: '3px solid var(--accent-primary)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto var(--spacing-lg)'
                }}></div>
                <p className="text-secondary">Processing payment...</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>
                  {[
                    { method: 'CARD', icon: '💳', label: 'Credit/Debit Card' },
                    { method: 'CASH', icon: '💰', label: 'Cash Payment' },
                    { method: 'UPI', icon: '📱', label: 'UPI Payment' }
                  ].map(({ method, icon, label }) => (
                    <button 
                      key={method}
                      onClick={() => setSelectedPaymentMethod(method)} 
                      className={`btn ${selectedPaymentMethod === method ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ justifyContent: 'flex-start', gap: 'var(--spacing-md)' }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                      <span>{label}</span>
                      {selectedPaymentMethod === method && (
                        <span style={{ marginLeft: 'auto', color: 'var(--accent-primary)' }}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-md">
                  <button onClick={handlePayment} className="btn btn-success" style={{ flex: 2 }}>
                    Confirm Payment
                  </button>
                  <button onClick={() => setShowPayment(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRating && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '400px', width: '90%', margin: 'var(--spacing-md)' }}>
            <div className="text-center mb-lg">
              <h3 className="heading-lg">Rate Your Ride</h3>
              <p className="text-secondary">How was your experience?</p>
            </div>
            
            <div className="text-center mb-lg">
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '2rem',
                      cursor: 'pointer',
                      color: star <= rating ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <p className="text-accent" style={{ fontWeight: '600' }}>
                {rating} out of 5 stars
              </p>
            </div>
            
            <div className="form-group mb-lg">
              <label>Share your experience (optional)</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Tell us about your ride..."
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>
            
            <div className="flex gap-md">
              <button onClick={handleRating} className="btn btn-primary" style={{ flex: 2 }}>
                Submit Rating
              </button>
              <button onClick={() => navigate('/user/dashboard')} className="btn btn-secondary" style={{ flex: 1 }}>
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default CurrentRide;
