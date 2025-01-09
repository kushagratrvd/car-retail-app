import axios from 'axios';

const API_URL = '/.netlify/functions/api';

const api = axios.create({
  baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (credentials) => api.post('/users/login', credentials);
export const register = (userData) => api.post('/users/register', userData);
export const getCars = () => api.get('/cars');
export const addCar = (carData) => api.post('/cars', carData);
export const deleteCar = (id) => api.delete(`/cars/${id}`);