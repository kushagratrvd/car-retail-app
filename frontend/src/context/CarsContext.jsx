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
      console.log('Fetching cars...');
      const response = await getCars();
      console.log('Cars response:', response);

      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid response data:', response.data);
        throw new Error('Invalid data format received from server');
      }
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setError(error.message || 'Failed to fetch cars');
      setCars([]); // Set empty array as fallback
    } finally {
      setLoading(false);
    }
  };

  const addCar = async (newCar) => {
    try {
      setError(null);
      const response = await apiAddCar(newCar);
      if (!response.data) {
        throw new Error('Invalid response data when adding car');
      }
      setCars(prevCars => [...prevCars, response.data]);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add car';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteCar = async (id) => {
    try {
      setError(null);
      await apiDeleteCar(id);
      setCars(prevCars => prevCars.filter(car => car._id !== id));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete car';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return (
    <CarsContext.Provider value={{ 
      cars, 
      loading, 
      error, 
      addCar, 
      deleteCar, 
      fetchCars,
      refresh: fetchCars // Alias for fetchCars for explicit refresh calls
    }}>
      {children}
    </CarsContext.Provider>
  );
};

