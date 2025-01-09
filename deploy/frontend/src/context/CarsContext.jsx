import React, { createContext, useState, useEffect } from 'react';
import { getCars, addCar as apiAddCar, deleteCar as apiDeleteCar } from '../services/api';

// Create the context
export const CarsContext = createContext();

// Provide the context to components
export const CarsProvider = ({ children }) => {
  const [cars, setCars] = useState([
    { 
    _id: 1, 
    name: 'Tesla Model 3', 
    description: 'Electric sedan with autopilot capability and 358-mile range. Features include premium interior and glass roof.',
    price: 41990,
    image: 'tesla-model-3.jpg'
  },
  { 
    _id: 2, 
    name: 'Ford Mustang', 
    description: 'Classic muscle car with 5.0L V8 engine, 460 horsepower, and signature styling. Includes SYNC 3 technology.',
    price: 37075,
    image: 'ford-mustang.jpg'
  },
  { 
    _id: 3, 
    name: 'Toyota Camry', 
    description: 'Reliable family sedan with advanced safety features, hybrid option, and comfortable interior.',
    price: 25945,
    image: 'toyota-camry.jpg'
  },
  { 
    _id: 4, 
    name: 'BMW M3', 
    description: 'Performance-focused luxury sports sedan with a 3.0L turbocharged engine, 473 horsepower.',
    price: 69900,
    image: 'bmw-m3.jpg'
  },
  { 
    _id: 5, 
    name: 'Chevrolet Corvette', 
    description: 'Iconic American sports car with 6.2L V8 engine, 495 horsepower, and cutting-edge design.',
    price: 59995,
    image: 'chevrolet-corvette.jpg'
  },
  { 
    _id: 6, 
    name: 'Audi A4', 
    description: 'Luxury compact sedan with a turbocharged 2.0L engine, quattro all-wheel drive, and premium features.',
    price: 39900,
    image: 'audi-a4.jpg'
  },
  { 
    _id: 7, 
    name: 'Mercedes-Benz E-Class', 
    description: 'Luxury sedan with 3.0L V6 engine, 362 horsepower, and advanced technology like MBUX infotainment.',
    price: 54100,
    image: 'mercedes-benz-e-class.jpg'
  },
  { 
    _id: 8, 
    name: 'Honda Accord', 
    description: 'Reliable mid-size sedan with advanced safety features, efficient hybrid option, and spacious interior.',
    price: 24950,
    image: 'honda-accord.jpg'
  },
  { 
    _id: 9, 
    name: 'Nissan Altima', 
    description: 'Comfortable sedan with all-wheel drive and efficient 2.5L 4-cylinder engine, delivering a smooth ride.',
    price: 24800,
    image: 'nissan-altima.jpg'
  },
  { 
    _id: 10, 
    name: 'Porsche 911', 
    description: 'Legendary sports car with rear-engine layout, 3.0L turbocharged flat-six engine, and exceptional handling.',
    price: 99950,
    image: 'porsche-911.jpg'
  },
]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await getCars();
      console.log('Fetched Cars:', response.data); // Log the fetched data
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const addCar = async (newCar) => {
    try {
      const response = await apiAddCar(newCar);
      setCars([...cars, response.data]);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteCar = async (id) => {
    try {
      await apiDeleteCar(id);
      setCars(cars.filter(car => car._id !== id));
    } catch (error) {
      throw error;
    }
  };

  return (
    <CarsContext.Provider value={{ cars, loading, error, addCar, deleteCar }}>
      {children}
    </CarsContext.Provider>
  );
};

