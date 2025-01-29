import axios from "axios"

// Update the API URL to match the Netlify function name
const API_URL = '/.netlify/functions/server';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Enhanced request logging
api.interceptors.request.use(
  (config) => {
    console.log("API Request:", {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      data: config.data,
      headers: config.headers,
    })
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error("Request Error:", error)
    return Promise.reject(error)
  },
)

// Enhanced response logging
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    })
    return response
  },
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
    })
    return Promise.reject(error)
  },
)

export const login = (credentials) => api.post("/users/login", credentials)
export const register = (userData) => api.post("/users/register", userData)
export const getCars = () => api.get("/cars")
export const addCar = (carData) => api.post("/cars", carData)
export const deleteCar = (id) => api.delete(`/cars/${id}`)

