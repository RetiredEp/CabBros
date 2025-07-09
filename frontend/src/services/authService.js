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

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth service functions
export const authService = {
  // User registration
  registerUser: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  // Driver registration
  registerDriver: async (driverData) => {
    const response = await api.post('/drivers/register', driverData);
    return response.data;
  },

  // User login
  loginUser: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    const token = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('role', 'USER');
    return token;
  },

  // Driver login
  loginDriver: async (credentials) => {
    const response = await api.post('/drivers/login', credentials);
    const token = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('role', 'DRIVER');
    return token;
  },

  // Get user profile
  getUserProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Get driver profile
  getDriverProfile: async () => {
    const response = await api.get('/drivers/profile');
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get current user role
  getRole: () => {
    return localStorage.getItem('role');
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;