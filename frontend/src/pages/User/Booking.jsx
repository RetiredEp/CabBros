// src/pages/User/UserBooking.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { rideService } from '../../services/rideService';
import './Booking.css';

// Component to handle map bounds
const MapBounds = ({ pickupCoords, dropoffCoords }) => {
  const map = useMap();

  useEffect(() => {
    if (pickupCoords && dropoffCoords) {
      const bounds = L.latLngBounds([
        [pickupCoords.lat, pickupCoords.lon],
        [dropoffCoords.lat, dropoffCoords.lon]
      ]);
      map.fitBounds(bounds, { padding: [20, 20] });
    } else if (pickupCoords) {
      map.setView([pickupCoords.lat, pickupCoords.lon], 15);
    } else if (dropoffCoords) {
      map.setView([dropoffCoords.lat, dropoffCoords.lon], 15);
    }
  }, [map, pickupCoords, dropoffCoords]);

  return null;
};

const Booking = () => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState('');
  const [fare, setFare] = useState(null);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rideBooked, setRideBooked] = useState(false);
  const navigate = useNavigate();

  // Debounced search function for location suggestions
  const searchPlaces = async (query, setSuggestions) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: query,
          format: 'json',
          limit: 5,
          countrycodes: 'in', // Limit to India
          addressdetails: 1
        },
      });

      if (res.data) {
        const suggestions = res.data.map(item => ({
          display_name: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon)
        }));
        setSuggestions(suggestions);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  // Handle pickup input change
  const handlePickupChange = (value) => {
    setPickup(value);
    setShowPickupSuggestions(true);
    
    // Debounce search
    clearTimeout(window.pickupTimeout);
    window.pickupTimeout = setTimeout(() => {
      searchPlaces(value, setPickupSuggestions);
    }, 300);
  };

  // Handle dropoff input change
  const handleDropoffChange = (value) => {
    setDropoff(value);
    setShowDropoffSuggestions(true);
    
    // Debounce search
    clearTimeout(window.dropoffTimeout);
    window.dropoffTimeout = setTimeout(() => {
      searchPlaces(value, setDropoffSuggestions);
    }, 300);
  };

  // Select pickup suggestion
  const selectPickupSuggestion = (suggestion) => {
    setPickup(suggestion.display_name);
    setPickupCoords({ lat: suggestion.lat, lon: suggestion.lon });
    setPickupSuggestions([]);
    setShowPickupSuggestions(false);
    
    // Clear previous calculations when changing pickup
    setDistance('');
    setDuration('');
    setFare(null);
  };

  // Select dropoff suggestion
  const selectDropoffSuggestion = (suggestion) => {
    // Check if same as pickup
    if (pickupCoords && 
        Math.abs(suggestion.lat - pickupCoords.lat) < 0.001 && 
        Math.abs(suggestion.lon - pickupCoords.lon) < 0.001) {
      setStatus('Pickup and dropoff cannot be the same location.');
      return;
    }
    
    setDropoff(suggestion.display_name);
    setDropoffCoords({ lat: suggestion.lat, lon: suggestion.lon });
    setDropoffSuggestions([]);
    setShowDropoffSuggestions(false);
    
    // Clear previous calculations when changing dropoff
    setDistance('');
    setDuration('');
    setFare(null);
  };


  const fetchCoords = async (address, setter) => {
    const res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: address,
        format: 'json',
        limit: 1,
      },
    });

    if (res.data && res.data.length > 0) {
      const lat = parseFloat(res.data[0].lat);
      const lon = parseFloat(res.data[0].lon);
      setter({ lat, lon });
    } else {
      alert('Location not found');
    }
  };

  const calculateDistance = () => {
    if (!pickupCoords || !dropoffCoords) return;

    const R = 6371; // Earth radius in km
    const dLat = ((dropoffCoords.lat - pickupCoords.lat) * Math.PI) / 180;
    const dLon = ((dropoffCoords.lon - pickupCoords.lon) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pickupCoords.lat * Math.PI) / 180) *
        Math.cos((dropoffCoords.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;

    setDistance(distanceKm.toFixed(2));
    setDuration((distanceKm * 3).toFixed(0)); // Estimate 3 minutes per km
    setFare((distanceKm * 25).toFixed(0)); // ₹25 per km
  };

  const handleBook = async () => {
    // Enhanced validation
    if (!pickup || !dropoff) {
      setStatus('Please enter both pickup and dropoff locations.');
      return;
    }

    if (!pickupCoords || !dropoffCoords) {
      setStatus('Please set both pickup and dropoff locations on the map.');
      return;
    }

    if (!distance || distance === '0.00') {
      setStatus('Please calculate distance first.');
      return;
    }

    // Check if pickup and dropoff are too close (less than 0.5 km)
    if (parseFloat(distance) < 0.5) {
      setStatus('Pickup and dropoff locations are too close. Minimum distance is 0.5 km.');
      return;
    }

    // Check if distance is too long (more than 100 km)
    if (parseFloat(distance) > 100) {
      setStatus('Distance too long. Maximum allowed distance is 100 km.');
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      const rideData = {
        pickupLocation: pickup,
        dropoffLocation: dropoff,
        distance: parseFloat(distance),
        fare: parseFloat(fare),
        status: 'REQUESTED'
      };

      await rideService.bookRide(rideData);
      
      setRideBooked(true);
      setSearching(true);
      setStatus('Searching for nearby drivers...');
      
      // Clear form after successful booking
      window.setTimeout(() => {
        // Don't clear if user is being redirected to current ride
        if (!searching) {
          setPickup('');
          setDropoff('');
          setPickupCoords(null);
          setDropoffCoords(null);
          setDistance('');
          setDuration('');
          setFare(null);
          setRideBooked(false);
        }
      }, 300000); // Clear after 5 minutes if no driver found

      const pollForDriver = () => {
        const interval = setInterval(async () => {
          try {
            const currentRide = await rideService.getCurrentRide();
            if (currentRide && currentRide.status === 'ACCEPTED') {
              clearInterval(interval);
              setSearching(false);
              setStatus('Driver found! Redirecting to current ride...');
              
              // Redirect to current ride page
              setTimeout(() => {
                navigate('/user/current-ride');
              }, 1500);
            }
          } catch (err) {
            // If no current ride found (404), keep polling
            console.log('Still searching for driver...', err.response?.status);
          }
        }, 3000); // Poll every 3 seconds
        
        // Stop polling after 5 minutes
        setTimeout(() => {
          clearInterval(interval);
          if (searching) {
            setSearching(false);
            setStatus('No drivers available at the moment. Please try again later.');
          }
        }, 300000); // 5 minutes
      };
      
      pollForDriver();

    } catch (error) {
      console.error('Booking error:', error);
      
      // Handle specific errors
      if (error.code === 'NETWORK_ERROR' || !error.response) {
        setStatus('Network error. Please check your connection and try again.');
      } else if (error.response?.status === 401) {
        setStatus('Session expired. Please login again.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.response?.status === 409) {
        setStatus('You already have an active ride. Please complete it first.');
      } else {
        setStatus(error.response?.data?.message || 'Failed to book ride. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  

  // Handle back navigation with confirmation if form has data
  const handleBack = () => {
    if (pickup || dropoff || distance) {
      if (window.confirm('You have unsaved data. Are you sure you want to go back?')) {
        navigate('/user/dashboard');
      }
    } else {
      navigate('/user/dashboard');
    }
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <header className="app-header">
          <h1 className="app-title">Book a Ride</h1>
          <button onClick={handleBack} className="btn btn-secondary">
            ← Dashboard
          </button>
        </header>

        <div className="app-card">
          {!rideBooked ? (
            <>
              <div className="input-group">
                <label>Pickup Location</label>
                <div className="input-with-button">
                  <input
                    type="text"
                    placeholder="Enter pickup address"
                    value={pickup}
                    onChange={(e) => handlePickupChange(e.target.value)}
                    onFocus={() => setShowPickupSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 200)}
                    className="app-input"
                  />
                  <button 
                    onClick={() => fetchCoords(pickup, setPickupCoords)}
                    className="btn btn-secondary"
                    disabled={!pickup}
                  >
                    Set Pickup
                  </button>
                </div>
                {showPickupSuggestions && pickupSuggestions.length > 0 && (
                  <div className="suggestions-list">
                    {pickupSuggestions.map((suggestion, index) => (
                      <div 
                        key={index} 
                        className="suggestion-item"
                        onClick={() => selectPickupSuggestion(suggestion)}
                      >
                        {suggestion.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="input-group">
                <label>Dropoff Location</label>
                <div className="input-with-button">
                  <input
                    type="text"
                    placeholder="Enter dropoff address"
                    value={dropoff}
                    onChange={(e) => handleDropoffChange(e.target.value)}
                    onFocus={() => setShowDropoffSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowDropoffSuggestions(false), 200)}
                    className="app-input"
                  />
                  <button 
                    onClick={() => fetchCoords(dropoff, setDropoffCoords)}
                    className="btn btn-secondary"
                    disabled={!dropoff}
                  >
                    Set Dropoff
                  </button>
                </div>
                {showDropoffSuggestions && dropoffSuggestions.length > 0 && (
                  <div className="suggestions-list">
                    {dropoffSuggestions.map((suggestion, index) => (
                      <div 
                        key={index} 
                        className="suggestion-item"
                        onClick={() => selectDropoffSuggestion(suggestion)}
                      >
                        {suggestion.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button 
                onClick={calculateDistance}
                className="btn btn-secondary"
                disabled={!pickupCoords || !dropoffCoords}
              >
                Calculate Distance & Fare
              </button>

              {distance && (
                <div className="ride-details">
                  <div className="detail-item">
                    <span>Distance:</span>
                    <span>{distance} km</span>
                  </div>
                  <div className="detail-item">
                    <span>Estimated Duration:</span>
                    <span>{duration} mins</span>
                  </div>
                  <div className="detail-item">
                    <span>Estimated Fare:</span>
                    <span>₹{fare}</span>
                  </div>
                </div>
              )}

              <button 
                onClick={handleBook}
                className="btn"
                disabled={!distance || loading || searching}
              >
                {loading ? 'Booking...' : searching ? 'Searching Driver...' : 'Book Ride'}
              </button>
            </>
          ) : null}

          {searching && (
            <div className="searching-indicator">
              <div className="loading-spinner"></div>
              <p>Searching for available drivers...</p>
              <p className="search-details">Please wait while we find you a ride</p>
            </div>
          )}

          {status && (
            <div className="status-message">
              {status}
            </div>
          )}
        </div>

        <div className="app-card">
          <MapContainer
            center={[17.385, 78.4867]}
            zoom={13}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {pickupCoords && <Marker position={[pickupCoords.lat, pickupCoords.lon]} />}
            {dropoffCoords && <Marker position={[dropoffCoords.lat, dropoffCoords.lon]} />}
            <MapBounds pickupCoords={pickupCoords} dropoffCoords={dropoffCoords} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Booking;
