import axios from 'axios';

// Get the current domain
const domain = window.location.hostname;
const isLocalhost = domain.includes('localhost') || domain.includes('127.0.0.1');

// Set the API URL based on environment
const API_URL = isLocalhost 
  ? 'http://localhost:8888/.netlify/functions/server'
  : '/.netlify/functions/server';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      method: config.method.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      data: config.data
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
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data
    });
    return Promise.reject(error);
  }
);

export const login = (credentials) => api.post('/users/login', credentials);
export const register = (userData) => api.post('/users/register', userData);
export const getCars = () => api.get('/cars');
export const addCar = (carData) => api.post('/cars', carData);
export const deleteCar = (id) => api.delete(`/cars/${id}`);

