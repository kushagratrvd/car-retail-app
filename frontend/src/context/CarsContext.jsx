import React, { createContext, useState, useEffect } from 'react';
import { getCars, addCar as apiAddCar, deleteCar as apiDeleteCar } from '../services/api';

export const CarsContext = createContext();

export const CarsProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCars();
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid data format received from server');
      }
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setError(error.message);
      setCars([]); // Set empty array as fallback
    } finally {
      setLoading(false);
    }
  };

  const addCar = async (newCar) => {
    try {
      setError(null);
      const response = await apiAddCar(newCar);
      setCars([...cars, response.data]);
      return response.data;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const deleteCar = async (id) => {
    try {
      setError(null);
      await apiDeleteCar(id);
      setCars(cars.filter(car => car._id !== id));
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return (
    <CarsContext.Provider value={{ cars, loading, error, addCar, deleteCar, fetchCars }}>
      {children}
    </CarsContext.Provider>
  );
};