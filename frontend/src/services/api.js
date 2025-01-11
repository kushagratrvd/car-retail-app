import axios from 'axios';

// Update the API URL to match the Netlify function name
const API_URL = '/.netlify/functions/server';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor with better logging
api.interceptors.request.use(
  (config) => {
    console.log('Sending Request:', {
      url: config.url,
      method: config.method,
      data: config.data
    });
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      endpoint: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return Promise.reject(error);
  }
);

export const login = (credentials) => api.post('/users/login', credentials);
export const register = (userData) => api.post('/users/register', userData);
export const getCars = () => api.get('/cars');
export const addCar = (carData) => api.post('/cars', carData);
export const deleteCar = (id) => api.delete(`/cars/${id}`);