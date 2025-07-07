import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Form, Modal, Table, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getEvents, createEvent, getVenues } from '../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    venue_id: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, venuesData] = await Promise.all([
          getEvents(),
          getVenues()
        ]);
        setEvents(eventsData);
        setVenues(venuesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load events. Please try again later.');
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
      const newEvent = await createEvent(formData);
      setEvents([...events, newEvent]);
      setShowModal(false);
      setFormData({
        name: '',
        description: '',
        date: '',
        venue_id: ''
      });
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Failed to create event. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return <div className="page-container">Loading events...</div>;
  }

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Events</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Create New Event
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {events.length === 0 ? (
        <Alert variant="info">No events found. Create your first event!</Alert>
      ) : (
        <Row>
          {events.map((event) => (
            <Col md={6} lg={4} key={event.id} className="mb-4">
              <Card>
                <Card.Header as="h5">{event.name}</Card.Header>
                <Card.Body>
                  <Card.Text>
                    <strong>Date:</strong> {formatDate(event.date)}
                  </Card.Text>
                  <Card.Text>
                    <strong>Venue:</strong> {event.venue ? event.venue.name : 'N/A'}
                  </Card.Text>
                  <Card.Text>
                    {event.description ? event.description.substring(0, 100) + '...' : 'No description available.'}
                  </Card.Text>
                  <Link to={`/events/${event.id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Create Event Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
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
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date and Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Venue</Form.Label>
              <Form.Select
                name="venue_id"
                value={formData.venue_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a venue</option>
                {venues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name} ({venue.location})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create Event
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Events; 