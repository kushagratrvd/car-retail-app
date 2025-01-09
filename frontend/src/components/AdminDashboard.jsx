import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { CarsContext } from '../context/CarsContext';
import CarCard from './CarCard';

const AdminDashboard = () => {
  const { cars, loading, error, addCar, deleteCar } = useContext(CarsContext);
  const [newCar, setNewCar] = useState({
    name: '',
    description: '',
    price: '',
    image: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  if (!localStorage.getItem('token')) {
    return (
      <Container>
        <Alert variant="danger">Please log in to access the admin dashboard.</Alert>
      </Container>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCar((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const price = parseFloat(newCar.price);

    if (!newCar.name || !newCar.description || isNaN(price) || !newCar.image) {
      setAlert({
        show: true,
        message: 'All fields are required and price must be a valid number!',
        variant: 'danger'
      });
      return;
    }

    try {
      await addCar({ ...newCar, price });
      setNewCar({ name: '', description: '', price: '', image: '' });
      setAlert({
        show: true,
        message: 'Car added successfully!',
        variant: 'success'
      });
    } catch (error) {
      setAlert({
        show: true,
        message: 'Failed to add car. Please try again.',
        variant: 'danger'
      });
    }

    setTimeout(() => setAlert({ show: false }), 3000);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCar(id);
      setAlert({
        show: true,
        message: 'Car deleted successfully!',
        variant: 'success'
      });
    } catch (error) {
      setAlert({
        show: true,
        message: 'Failed to delete car. Please try again.',
        variant: 'danger'
      });
    }
    setTimeout(() => setAlert({ show: false }), 3000);
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          Error loading cars: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-md-center mb-4">
        <Col md={8}>
          <h2 className="text-center mb-4">Admin Dashboard</h2>
          {alert.show && (
            <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
              {alert.message}
            </Alert>
          )}
        </Col>
      </Row>

      <Row className="justify-content-md-center mb-5">
        <Col md={8}>
          <h3>Add New Car</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Car Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newCar.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newCar.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price ($)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={newCar.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                name="image"
                value={newCar.image}
                onChange={handleInputChange}
                required
                placeholder="Enter image URL"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Add Car
            </Button>
          </Form>
        </Col>
      </Row>

      <Row>
        <Col>
          <h3 className="text-center mb-4">Manage Cars</h3>
        </Col>
      </Row>
      <Row xs={1} md={2} lg={3} className="g-4">
        {Array.isArray(cars) && cars.map((car) => (
          <Col key={car._id}>
            <CarCard
              car={car}
              isAdmin={true}
              onDelete={() => handleDelete(car._id)}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminDashboard;