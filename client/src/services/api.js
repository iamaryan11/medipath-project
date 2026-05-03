import axios from 'axios';

// Setup Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:1111/api', // Pointing to the Express Gateway
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to inject the JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));
