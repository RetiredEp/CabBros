// src/utils/connectionTest.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

export const testConnection = async () => {
  try {
    // Simple health check endpoint
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 5000 // 5 second timeout
    });
    return { connected: true, status: response.status };
  } catch (error) {
    return { 
      connected: false, 
      error: error.code === 'NETWORK_ERROR' ? 'Network error' : 'Server unavailable' 
    };
  }
};
