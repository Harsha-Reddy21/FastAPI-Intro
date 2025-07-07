import React, { useEffect, useState } from 'react';
import { Card, Button, Table, Form, Modal, Alert } from 'react-bootstrap';
import { getTicketTypes, createTicketType, getEvents } from '../services/api';

const TicketTypes = () => {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity_available: '',
    event_id: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketTypesData, eventsData] = await Promise.all([
          getTicketTypes(),
          getEvents()
        ]);
        setTicketTypes(ticketTypesData);
        setEvents(eventsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load ticket types. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert numeric fields
      const ticketTypeData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity_available: parseInt(formData.quantity_available),
        event_id: parseInt(formData.event_id)
      };
      
      const newTicketType = await createTicketType(ticketTypeData);
      setTicketTypes([...ticketTypes, newTicketType]);
      setShowModal(false);
      setFormData({
        name: '',
        price: '',
        quantity_available: '',
        event_id: ''
      });
    } catch (error) {
      console.error('Error creating ticket type:', error);
      setError('Failed to create ticket type. Please try again.');
    }
  };

  const getEventName = (eventId) => {
    const event = events.find(e => e.id === eventId);
    return event ? event.name : 'Unknown Event';
  };

  if (loading) {
    return <div className="page-container">Loading ticket types...</div>;
  }

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Ticket Types</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Create New Ticket Type
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Available Quantity</th>
                <th>Event</th>
              </tr>
            </thead>
            <tbody>
              {ticketTypes.length > 0 ? (
                ticketTypes.map((ticketType) => (
                  <tr key={ticketType.id}>
                    <td>{ticketType.name}</td>
                    <td>${ticketType.price.toFixed(2)}</td>
                    <td>{ticketType.quantity_available}</td>
                    <td>{getEventName(ticketType.event_id)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No ticket types found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Create Ticket Type Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Ticket Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., VIP, Standard, Economy"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 99.99"
                step="0.01"
                min="0"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Available Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity_available"
                value={formData.quantity_available}
                onChange={handleInputChange}
                placeholder="e.g., 100"
                min="1"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Event</Form.Label>
              <Form.Select
                name="event_id"
                value={formData.event_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select an event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} - {new Date(event.date).toLocaleDateString()}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create Ticket Type
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TicketTypes; 