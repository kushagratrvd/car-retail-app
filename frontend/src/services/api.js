import axios from 'axios';

const API_URL = '/.netlify/functions/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      method: config.method.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      data: config.data,
      headers: config.headers
    });
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: error.config
    });
    return Promise.reject(error);
  }
);

// API endpoints
export const login = (credentials) => api.post('/users/login', credentials);
export const register = (userData) => api.post('/users/register', userData);
export const getCars = () => api.get('/cars');
export const addCar = (carData) => api.post('/cars', carData);
export const deleteCar = (id) => api.delete(`/cars/${id}`);

// Health check
export const checkHealth = () => api.get('/health');

