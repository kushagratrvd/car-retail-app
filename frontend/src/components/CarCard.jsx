import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

const CarCard = ({ car, isAdmin, onDelete, onBuy }) => {
  // Sample car images - replace with your actual car images
  const carImages = {
    'Tesla Model 3': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop',
    'Ford Mustang': 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&auto=format&fit=crop',
    'Toyota Camry': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop',
    'BMW 3 Series': 'https://images.unsplash.com/photo-1594673664797-11b9db27d2f6?w=800&auto=format&fit=crop',
    'Audi A4': 'https://images.unsplash.com/photo-1563720226616-c6ffef28e0f6?w=800&auto=format&fit=crop',
    'Mercedes-Benz C-Class': 'https://images.unsplash.com/photo-1558391310-bf7c5e144478?w=800&auto=format&fit=crop',
    'Honda Accord': 'https://images.unsplash.com/photo-1622447100473-2f530bfcda23?w=800&auto=format&fit=crop',
    'Chevrolet Camaro': 'https://images.unsplash.com/photo-1574869418684-bc0c9b26d9c1?w=800&auto=format&fit=crop',
    'Porsche 911': 'https://images.unsplash.com/photo-1610301925698-b0dcd449d1f7?w=800&auto=format&fit=crop',
    'Lexus RX': 'https://images.unsplash.com/photo-1618221094518-4adf6b0de93f?w=800&auto=format&fit=crop',
    'Volkswagen Golf': 'https://images.unsplash.com/photo-1590247813697-c1c5f4b61582?w=800&auto=format&fit=crop',
    'Nissan Altima': 'https://images.unsplash.com/photo-1587460373275-702ed5e3b369?w=800&auto=format&fit=crop',
    'Jeep Wrangler': 'https://images.unsplash.com/photo-1519643225200-03da4e959989?w=800&auto=format&fit=crop',
  };

  return (
    <Card className="h-100 shadow-sm hover:shadow-lg transition-shadow duration-200">
      <Card.Img 
        variant="top" 
        src={carImages[car.name] || car.image} 
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Card.Title className="mb-0">{car.name}</Card.Title>
          <Badge bg="primary" className="px-2 py-1">${car.price}</Badge>
        </div>
        <Card.Text>{car.description}</Card.Text>
        <div className="mt-auto">
          {isAdmin ? (
            <Button variant="danger" onClick={() => onDelete(car._id)}>
              Delete Car
            </Button>
          ) : (
            <Button 
              variant="primary" 
              onClick={() => onBuy(car)}
              className="w-100"
            >
              Buy Now
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CarCard;

