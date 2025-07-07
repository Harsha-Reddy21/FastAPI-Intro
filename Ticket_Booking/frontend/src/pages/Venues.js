import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Form, Modal, Table, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getVenues, createVenue } from '../services/api';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    description: ''
  });

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const data = await getVenues();
        setVenues(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching venues:', error);
        setError('Failed to load venues. Please try again later.');
        setLoading(false);
      }
    };

    fetchVenues();
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
      // Convert capacity to number
      const venueData = {
        ...formData,
        capacity: parseInt(formData.capacity)
      };
      
      const newVenue = await createVenue(venueData);
      setVenues([...venues, newVenue]);
      setShowModal(false);
      setFormData({
        name: '',
        location: '',
        capacity: '',
        description: ''
      });
    } catch (error) {
      console.error('Error creating venue:', error);
      setError('Failed to create venue. Please try again.');
    }
  };

  if (loading) {
    return <div className="page-container">Loading venues...</div>;
  }

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Venues</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add New Venue
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {venues.length === 0 ? (
        <Alert variant="info">No venues found. Add your first venue!</Alert>
      ) : (
        <Row>
          {venues.map((venue) => (
            <Col md={6} lg={4} key={venue.id} className="mb-4">
              <Card>
                <Card.Header as="h5">{venue.name}</Card.Header>
                <Card.Body>
                  <Card.Text>
                    <strong>Location:</strong> {venue.location}
                  </Card.Text>
                  <Card.Text>
                    <strong>Capacity:</strong> {venue.capacity} people
                  </Card.Text>
                  <Card.Text>
                    {venue.description ? venue.description.substring(0, 100) + '...' : 'No description available.'}
                  </Card.Text>
                  <Link to={`/venues/${venue.id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Add Venue Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Venue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Venue Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                required
                min="1"
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

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Venue
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Venues; 