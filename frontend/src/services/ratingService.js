import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Rating service functions
export const ratingService = {
  // Submit rating
  submitRating: async (ratingData) => {
    const response = await api.post('/ratings/submit', ratingData);
    return response.data;
  },

  // Get ratings for driver
  getDriverRatings: async (driverId) => {
    const response = await api.get(`/ratings/driver/${driverId}`);
    return response.data;
  }
};

export default ratingService;
