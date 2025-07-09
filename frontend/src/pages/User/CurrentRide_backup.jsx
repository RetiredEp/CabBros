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

  return (
    <div className="page-container">
      <header className="header">
        <h1>Current Ride</h1>
        <button onClick={() => navigate('/user/dashboard')} className="btn btn-secondary">
          ← Dashboard
        </button>
      </header>

      <div className="page-content">
        <div className="ride-status-card">
          <div className="status-indicator">
            <div className={`status-dot ${ride.status.toLowerCase()}`}></div>
            <span className="status-text">{ride.status}</span>
          </div>
          
          <div className="ride-id">Ride #{ride.rideId}</div>
        </div>

        <div className="ride-details-card">
          <div className="route-section">
            <div className="route-point">
              <div className="route-icon pickup">📍</div>
              <div className="route-info">
                <div className="route-label">Pickup Location</div>
                <div className="route-address">{ride.pickupLocation}</div>
              </div>
            </div>
            
            <div className="route-line"></div>
            
            <div className="route-point">
              <div className="route-icon dropoff">🏁</div>
              <div className="route-info">
                <div className="route-label">Dropoff Location</div>
                <div className="route-address">{ride.dropoffLocation}</div>
              </div>
            </div>
          </div>

          <div className="ride-info-grid">
            <div className="info-item">
              <span className="info-label">Distance</span>
              <span className="info-value">{ride.distance} km</span>
            </div>
            <div className="info-item">
              <span className="info-label">Fare</span>
              <span className="info-value">₹{ride.fare}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Requested At</span>
              <span className="info-value">
                {new Date(ride.requestedAt || ride.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {ride.driver && (
          <div className="driver-card">
            <h3>Your Driver</h3>
            <div className="driver-info">
              <div className="driver-avatar">
                {ride.driver.name.charAt(0).toUpperCase()}
              </div>
              <div className="driver-details">
                <div className="driver-name">{ride.driver.name}</div>
                <div className="driver-phone">{ride.driver.phone}</div>
                <div className="driver-vehicle">{ride.driver.vehicleDetails}</div>
                <div className="driver-license">License: {ride.driver.licenseNumber}</div>
              </div>
            </div>
            <div className="driver-actions">
              <button className="call-driver-btn">📞 Call Driver</button>
              <button className="message-driver-btn">💬 Message</button>
            </div>
          </div>
        )}

        {ride.status === 'COMPLETED' && (
          <div className="completed-actions">
            {!showPayment && !showRating && (
              <button onClick={() => setShowPayment(true)} className="pay-btn">
                💳 Pay ₹{ride.fare}
              </button>
            )}
          </div>
        )}

        {showPayment && (
          <div className="payment-modal">
            <div className="modal-content">
              <h3>Payment</h3>
              <p>Amount: ₹{ride.fare}</p>
              {paymentLoading ? (
                <div className="payment-loading">
                  <div className="spinner"></div>
                  <p>Processing payment...</p>
                </div>
              ) : (
                <>
                  <div className="payment-methods">
                    <button 
                      onClick={() => setSelectedPaymentMethod('CARD')} 
                      className={`payment-method ${selectedPaymentMethod === 'CARD' ? 'selected' : ''}`}
                    >
                      💳 Card
                    </button>
                    <button 
                      onClick={() => setSelectedPaymentMethod('CASH')} 
                      className={`payment-method ${selectedPaymentMethod === 'CASH' ? 'selected' : ''}`}
                    >
                      💰 Cash
                    </button>
                    <button 
                      onClick={() => setSelectedPaymentMethod('UPI')} 
                      className={`payment-method ${selectedPaymentMethod === 'UPI' ? 'selected' : ''}`}
                    >
                      📱 UPI
                    </button>
                  </div>
                  <button onClick={handlePayment} className="confirm-payment">
                    Confirm Payment (₹{ride.fare})
                  </button>
                  <button onClick={() => setShowPayment(false)} className="cancel-payment">Cancel</button>
                </>
              )}
            </div>
          </div>
        )}

        {showRating && (
          <div className="rating-modal">
            <div className="modal-content">
              <h3>Rate Your Ride</h3>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`star ${star <= rating ? 'active' : ''}`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience (optional)"
                className="review-input"
              />
              <div className="rating-actions">
                <button onClick={handleRating} className="submit-rating">Submit</button>
                <button onClick={() => navigate('/user/dashboard')} className="skip-rating">Skip</button>
              </div>
            </div>
          </div>
        )}

        {ride.status === 'REQUESTED' && (
          <div className="waiting-message">
            <div className="pulse-animation"></div>
            <p>Searching for nearby drivers...</p>
            <p>Please wait while we find you a ride.</p>
          </div>
        )}

        {ride.status === 'ACCEPTED' && (
          <div className="driver-coming">
            <div className="coming-animation">🚗</div>
            <p>Driver is on the way to pick you up!</p>
            <p>Please be ready at the pickup location.</p>
          </div>
        )}

        {ride.status === 'IN_PROGRESS' && (
          <div className="ride-in-progress">
            <div className="progress-animation">🛣️</div>
            <p>You're on your way!</p>
            <p>Enjoy your ride to the destination.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .current-ride-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .ride-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .back-btn {
          background: #6c757d;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
        }

        .ride-status-card {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 25px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .status-dot.requested { background: #ffc107; }
        .status-dot.accepted { background: #17a2b8; }
        .status-dot.in_progress { background: #28a745; }
        .status-dot.completed { background: #6f42c1; }

        .status-text {
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .ride-id {
          color: #666;
          font-size: 14px;
        }

        .ride-details-card, .driver-card {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 25px;
          margin-bottom: 20px;
        }

        .route-section {
          margin-bottom: 25px;
        }

        .route-point {
          display: flex;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .route-icon {
          width: 30px;
          text-align: center;
          font-size: 16px;
          margin-right: 15px;
          margin-top: 2px;
        }

        .route-info {
          flex: 1;
        }

        .route-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .route-address {
          color: #333;
          font-size: 16px;
          line-height: 1.4;
        }

        .route-line {
          width: 2px;
          height: 25px;
          background: #ddd;
          margin-left: 14px;
          margin-bottom: 15px;
        }

        .ride-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .info-item {
          text-align: center;
        }

        .info-label {
          display: block;
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .info-value {
          font-size: 18px;
          font-weight: bold;
          color: #333;
        }

        .driver-info {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }

        .driver-avatar {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          font-weight: bold;
          margin-right: 20px;
        }

        .driver-details {
          flex: 1;
        }

        .driver-name {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .driver-phone, .driver-vehicle, .driver-license {
          color: #666;
          margin-bottom: 2px;
        }

        .driver-actions {
          display: flex;
          gap: 10px;
        }

        .call-driver-btn, .message-driver-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .call-driver-btn {
          background: #28a745;
          color: white;
        }

        .message-driver-btn {
          background: #007bff;
          color: white;
        }

        .completed-actions {
          text-align: center;
          margin: 20px 0;
        }

        .pay-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 18px;
          font-weight: 600;
        }

        .payment-modal, .rating-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 15px;
          min-width: 300px;
          text-align: center;
        }

        .payment-methods {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin: 20px 0;
        }

        .payment-method {
          padding: 15px 20px;
          border: 2px solid #ddd;
          border-radius: 10px;
          background: white;
          cursor: pointer;
          transition: all 0.3s;
        }

        .payment-method:hover {
          border-color: #007bff;
          background: #f8f9fa;
        }

        .payment-loading {
          padding: 20px;
          text-align: center;
        }

        .payment-loading .spinner {
          margin: 0 auto 15px;
        }

        .rating-stars {
          display: flex;
          justify-content: center;
          gap: 5px;
          margin: 20px 0;
        }

        .star {
          background: none;
          border: none;
          font-size: 30px;
          cursor: pointer;
          opacity: 0.3;
          transition: opacity 0.3s;
        }

        .star.active {
          opacity: 1;
        }

        .review-input {
          width: 100%;
          min-height: 100px;
          padding: 15px;
          border: 2px solid #ddd;
          border-radius: 8px;
          resize: vertical;
          margin: 15px 0;
        }

        .rating-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .submit-rating, .skip-rating {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .submit-rating {
          background: #28a745;
          color: white;
        }

        .skip-rating {
          background: #6c757d;
          color: white;
        }

        .waiting-message, .driver-coming, .ride-in-progress {
          text-align: center;
          padding: 40px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .pulse-animation, .coming-animation, .progress-animation {
          font-size: 48px;
          margin-bottom: 20px;
          animation: bounce 2s infinite;
        }

        .loading-container, .error-container {
          text-align: center;
          padding: 60px 20px;
        }

        .spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        .book-ride-btn, .dashboard-btn {
          margin: 10px;
          padding: 15px 30px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
        }

        .book-ride-btn {
          background: #28a745;
          color: white;
        }

        .dashboard-btn {
          background: #007bff;
          color: white;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default CurrentRide;
