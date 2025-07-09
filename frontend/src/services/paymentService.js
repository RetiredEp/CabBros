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

// Payment service functions
export const paymentService = {
  // Process payment
  processPayment: async (paymentData) => {
    const response = await api.post('/payment/pay', paymentData);
    return response.data;
  },

  // Get payment receipt
  getPaymentReceipt: async (rideId) => {
    const response = await api.get(`/payment/receipt/${rideId}`);
    return response.data;
  }
};

export default paymentService;
