import React, { useContext, useState } from 'react';
import { Container, Row, Col, Modal, Button, Form } from 'react-bootstrap';
import CarCard from './CarCard';
import { CarsContext } from '../context/CarsContext.jsx';

const UserDashboard = () => {
  const { cars } = useContext(CarsContext);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const handleBuy = (car) => {
    setSelectedCar(car);
    setShowPurchaseModal(true);
  };

  const handlePurchaseConfirm = (e) => {
    e.preventDefault();
    // Here you would typically process the purchase
    alert(`Thank you for purchasing the ${selectedCar.name}!`);
    setShowPurchaseModal(false);
  };

  return (
    <Container>
      <div className="py-5">
        <h2 className="mb-4">Available Cars</h2>
        <Row xs={1} md={2} lg={3} className="g-4">
          {cars.map((car) => (
            <Col key={car._id}>
              <CarCard 
                car={car} 
                isAdmin={false}
                onBuy={handleBuy}
              />
            </Col>
          ))}
        </Row>
      </div>

      <Modal show={showPurchaseModal} onHide={() => setShowPurchaseModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Purchase Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCar && (
            <Form onSubmit={handlePurchaseConfirm}>
              <h4>{selectedCar.name}</h4>
              <p>Price: ${selectedCar.price}</p>
              <Form.Group className="mb-3">
                <Form.Label>Payment Method</Form.Label>
                <Form.Select required>
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                  <option>Bank Transfer</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Delivery Address</Form.Label>
                <Form.Control as="textarea" rows={3} required />
              </Form.Group>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={() => setShowPurchaseModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Confirm Purchase
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UserDashboard;

